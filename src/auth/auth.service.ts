import { CONFIG } from '@app/config';
import { PrismaService } from '@app/db';
import { compareHashedString, hashString } from '@app/utils';
import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Role } from '@prisma/client';
import { addMilliseconds } from 'date-fns';
import { User, UserSelectDefaultValue } from '../modules/users';
import { AuthLoginDto } from './dto/auth-login.dto';
import { AuthToken, JwtPayload } from './entity';
import * as msParse from 'ms';

/**
 * Service for authenticating user
 */
@Injectable()
export class AuthService {
  constructor(
    private prismaService: PrismaService,
    private jwtService: JwtService,
  ) {}

  /**
   * Login service. Return a user object with a user token.
   * Throws an error when user is not found or password
   * doesn't match
   */
  async login(
    authLogin: AuthLoginDto,
    session: string,
    ipAddress: string,
    userAgent: string,
  ): Promise<AuthToken> {
    //  Get user and password

    const user = (await this.prismaService.user.findUnique({
      where: { email: authLogin.email },
      select: { id: true, email: true, password: true, roles: true },
    })) as any;

    //  Throw if user not found

    if (!user) throw new ForbiddenException('Access Denied');

    //  Throw if invalid password

    if (!compareHashedString(authLogin.password, user.password))
      throw new ForbiddenException('Access Denied');

    // Get tokens

    const tokens = this.getTokens(user.id, user.email, user.roles);

    // Update refresh token

    await this.updateRefreshToken(
      user.id,
      tokens.refreshToken,
      session,
      ipAddress,
      userAgent,
    );

    // Delete password from user object

    delete user.password;

    return tokens;
  }

  /**
   *  Validate the refresh token and regenerate the tokens
   */

  async refreshTokens(
    userId: number,
    refreshToken: string,
    session: string,
    ipAddress: string,
    userAgent: string,
  ): Promise<AuthToken> {
    // Find user

    const user = await this.prismaService.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        id: true,
        email: true,
        roles: true,
      },
    });

    // Throw if user or refresh token is null

    if (!user) throw new ForbiddenException('User not found');

    // Get session

    const hashedSn = hashString(session);

    const _session = await this.prismaService.session.findUnique({
      where: {
        unique_session: {
          userId: userId,
          hashedSn: hashedSn,
        },
      },
      select: {
        hashedRt: true,
      },
    });

    // Throw if invalid hash

    // console.log(refreshToken);
    // console.log(user.refreshToken);

    if (!compareHashedString(refreshToken, _session.hashedRt))
      throw new ForbiddenException('Invalid token');

    // Get new tokens

    const tokens = this.getTokens(user.id, user.email, user.roles);

    // Update refresh token

    await this.updateRefreshToken(
      user.id,
      tokens.refreshToken,
      session,
      ipAddress,
      userAgent,
    );

    return tokens;
  }

  /**
   * Update and store a hashed refresh token in the database
   */

  async updateRefreshToken(
    userId: number,
    refreshToken: string,
    session: string,
    ipAddress: string,
    userAgent: string,
  ): Promise<void> {
    const hashedRt = hashString(refreshToken);
    const hashedSn = hashString(session);
    const expirationDate = addMilliseconds(
      new Date(),
      msParse(CONFIG.security.refreshTokenExpiry),
    );

    await this.prismaService.session.upsert({
      where: {
        unique_session: {
          userId: userId,
          hashedSn: hashedSn,
        },
      },
      create: {
        userId: userId,
        hashedRt: hashedRt,
        hashedSn: hashedSn,
        ipAddress: ipAddress,
        userAgent: userAgent,
        expirationDate: expirationDate,
      },
      update: {
        hashedRt: hashedRt,
        expirationDate: expirationDate,
      },
    });
  }

  /**
   * Access token and refresh token generator
   */

  getTokens(userId: number, email: string, roles: Role[] = []): AuthToken {
    const payload: JwtPayload = {
      sub: userId,
      email: email,
      roles: roles,
    };

    const accessToken = this.jwtService.sign(payload, {
      secret: CONFIG.security.accessTokenSecret,
      expiresIn: CONFIG.security.accessTokenExpiry,
    });

    const refreshToken = this.jwtService.sign(payload, {
      secret: CONFIG.security.refreshTokenSecret,
      expiresIn: CONFIG.security.refreshTokenExpiry,
    });

    return {
      accessToken: accessToken,
      refreshToken: refreshToken,
    };
  }

  /**
   * Logout and clear refresh token from db
   */

  async logout(userId: number, session: string): Promise<boolean> {
    const hashedSn = hashString(session);
    await this.prismaService.session
      .delete({
        where: {
          unique_session: {
            userId: userId,
            hashedSn: hashedSn,
          },
        },
      })
      .catch((e) => {
        if (e.code === 'P2025') return true;
        else throw new ForbiddenException('Unable to logout');
      });

    return true;
  }
}
