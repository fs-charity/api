import { CONFIG } from '@app/config';
import { PrismaService } from '@app/db';
import { compareHashedString, hashString } from '@app/utils';
import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Role } from '@prisma/client';
import { add, addMilliseconds } from 'date-fns';
import { AuthLoginDto, AuthSignupDto } from './dto/auth.dto';
import { AuthToken, JwtPayload } from './entity';
import * as msParse from 'ms';
import { MailSenderService } from '@app/mail-sender';
import { nanoid } from 'nanoid';
import { ResponseBody } from '@app/types';

/**
 * Service for authenticating user
 */
@Injectable()
export class AuthService {
  constructor(
    private prismaService: PrismaService,
    private jwtService: JwtService,
    private mailSenderService: MailSenderService,
  ) {}

  /**
   * New user signup
   */
  async signup(authSignup: AuthSignupDto): Promise<ResponseBody> {
    let date = new Date();

    // Find existing user

    let user = await this.prismaService.user.findUnique({
      where: { email: authSignup.email },
      select: {
        id: true,
        emailVerified: true,
        verificationToken: true,
        verificationExpiry: true,
      },
    });

    // If user exist
    if (user) {
      // Throw if user already registered and verified
      if (user.emailVerified)
        throw new ForbiddenException(
          'The user has already been registered. Please proceed to login.',
        );
      // Throw if user already registered but not verified
      else
        throw new ForbiddenException(
          'This email has already been registered. Please check your email and verify your email to login',
        );
    }

    // Create user with verification token

    const emailVerificationToken = nanoid();

    user = await this.prismaService.user.create({
      data: {
        email: authSignup.email,
        password: hashString(authSignup.password),
        name: authSignup.name,
        roles: [Role.USER],
        verificationToken: emailVerificationToken,
        verificationExpiry: add(date, { hours: 24 }),
      },
    });

    // Send email with verification token

    await this.mailSenderService.sendVerifyEmailMail(
      authSignup.name,
      authSignup.email,
      emailVerificationToken,
    );

    // Return success message, check your email for verification

    return {
      statusCode: 201,
      status: 'Created',
      message:
        'User has been created. Please check your email and verify your account.',
    };
  }

  /**
   * Resend email verification
   */
  async resendEmailVerification(email: string): Promise<ResponseBody> {
    let date = new Date();

    // Find existing user

    let user = await this.prismaService.user.findUnique({
      where: { email: email },
      select: {
        id: true,
        name: true,
        emailVerified: true,
      },
    });

    // Throw if user doesn't exist

    if (!user)
      throw new NotFoundException(
        "Unable to send verification email. User doesn't exist",
      );

    // Throw if user already verified
    if (user.emailVerified)
      throw new ForbiddenException(
        'This account has already been verified. Please proceed to login.',
      );

    // Update user with new verification token

    const emailVerificationToken = nanoid();

    await this.prismaService.user.update({
      where: {
        email: email,
      },
      data: {
        verificationToken: emailVerificationToken,
        verificationExpiry: add(date, { hours: 24 }),
      },
    });

    // Send email with verification token

    await this.mailSenderService.sendVerifyEmailMail(
      user.name,
      email,
      emailVerificationToken,
    );

    // Return success message, check your email for verification

    return {
      statusCode: 201,
      status: 'Created',
      message:
        'A new verification link has been sent to your email. Please check your email and verify your account.',
    };
  }

  /**
   * Verify email
   */

  async verifyEmail(token: string) {
    // Get user

    let user = await this.prismaService.user.findUnique({
      where: { verificationToken: token },
      select: {
        id: true,
        email: true,
        emailVerified: true,
        verificationToken: true,
        verificationExpiry: true,
      },
    });

    // If user doesn't exist, throw error

    if (!user) throw new NotFoundException('Invalid token');

    // If user exist, but token has expired

    if (user.verificationExpiry < new Date())
      throw new ForbiddenException(
        'The verification token is expired. Please request a new verification link',
      );

    // Verify user email

    user = await this.prismaService.user.update({
      where: { id: user.id },
      data: {
        emailVerified: true,
        verificationToken: null,
        verificationExpiry: null,
      },
    });

    // Return success message

    return {
      statusCode: 200,
      status: 'Success',
      message: 'Email has been verified. You can proceed to login.',
    };
  }

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
      select: {
        id: true,
        email: true,
        password: true,
        roles: true,
        emailVerified: true,
      },
    })) as any;

    //  Throw if user not found

    if (!user) throw new ForbiddenException('Access Denied');

    //  Throw if invalid password

    if (!compareHashedString(authLogin.password, user.password))
      throw new ForbiddenException('Access Denied');

    // Throw if user is not verified

    if (!user.emailVerified)
      throw new ForbiddenException(
        'Your email is not verified. Pleas verify your email first',
      );

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
    ipAddress?: string,
    userAgent?: string,
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
    sessionId: string,
    ipAddress?: string,
    userAgent?: string,
  ): Promise<void> {
    const hashedRt = hashString(refreshToken);
    const hashedSn = hashString(sessionId);
    const expirationDate = addMilliseconds(
      new Date(),
      msParse(CONFIG.security.refreshTokenExpiry),
    );

    let session = await this.prismaService.session.findUnique({
      where: {
        unique_session: {
          userId: userId,
          hashedSn: hashedSn,
        },
      },
      select: {
        id: true,
      },
    });

    if (session) {
      await this.prismaService.session.update({
        where: {
          id: session.id,
        },
        data: {
          hashedRt: hashedRt,
          expirationDate: expirationDate,
        },
      });
    } else {
      await this.prismaService.session.create({
        data: {
          userId: userId,
          hashedRt: hashedRt,
          hashedSn: hashedSn,
          ipAddress: ipAddress,
          userAgent: userAgent,
          expirationDate: expirationDate,
        },
      });
    }
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
