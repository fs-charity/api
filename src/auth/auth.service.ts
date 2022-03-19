import { CONFIG } from '@app/config';
import { PrismaService } from '@app/db';
import { compareHashedString, hashString } from '@app/utils';
import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User, UserSelectDefaultValue } from '../modules/users';
import { AuthLoginDto } from './dto/auth-login.dto';
import { AuthToken, JwtPayload } from './entity';

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
  async login(authLogin: AuthLoginDto): Promise<AuthToken> {
    //  Get user and password

    const user = (await this.prismaService.user.findUnique({
      where: { email: authLogin.email },
      select: { id: true, email: true, password: true },
    })) as any;

    //  Throw if user not found

    if (!user) throw new ForbiddenException('Access Denied');

    //  Throw if invalid password

    if (!compareHashedString(authLogin.password, user.password))
      throw new ForbiddenException('Access Denied');

    // Get tokens

    const tokens = this.getTokens(user.id, user.email);

    // Update refresh token

    await this.updateRefreshToken(user.id, tokens.refreshToken);

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
  ): Promise<AuthToken> {
    // Find user

    const user = await this.prismaService.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        id: true,
        email: true,
        refreshToken: true,
      },
    });

    // Throw if user or refresh token is null

    if (!user || !user.refreshToken)
      throw new ForbiddenException('User not found');

    // Throw if invalid hash

    // console.log(refreshToken);
    // console.log(user.refreshToken);

    if (!compareHashedString(refreshToken, user.refreshToken))
      throw new ForbiddenException('Invalid token');

    // Get new tokens

    const tokens = this.getTokens(user.id, user.email);

    // Update refresh token

    await this.updateRefreshToken(user.id, tokens.refreshToken);

    return tokens;
  }

  /**
   * Update and store a hashed refresh token in the database
   */

  async updateRefreshToken(
    userId: number,
    refreshToken: string,
  ): Promise<void> {
    const hash = hashString(refreshToken);

    await this.prismaService.user.update({
      where: { id: userId },
      data: {
        refreshToken: hash,
      },
    });
  }

  /**
   * Access token and refresh token generator
   */

  getTokens(userId: number, email: string): AuthToken {
    const payload: JwtPayload = {
      sub: userId,
      email: email,
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
}
