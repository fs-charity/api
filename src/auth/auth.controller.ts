import {
  CaslPoliciesGuard,
  CheckPolicies,
  SessionManagePolicy,
} from '@app/casl';
import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  Param,
  Post,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Payload } from 'src/common/decorators';
import { Public } from 'src/common/decorators/public.decorator';

import { AccessTokenGuard } from 'src/common/guards/access-token.guard';
import { RefreshTokenGuard } from 'src/common/guards/refresh-token.guard';

import { AuthService } from './auth.service';
import { AuthEmailDto, AuthLoginDto, AuthSignupDto } from './dto/auth.dto';
import { JwtPayload, JwtPayloadWithRefreshToken } from './entity';
import * as crypto from 'crypto';
import { add } from 'date-fns';
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('signup')
  signup(@Body() authSignup: AuthSignupDto) {
    return this.authService.signup(authSignup);
  }

  @Public()
  @Get('verify')
  verifyEmail(@Query('token') token: string) {
    return this.authService.verifyEmail(token);
  }

  @Public()
  @Post('resend')
  resendEmailVerification(@Body() body: AuthEmailDto) {
    return this.authService.resendEmailVerification(body.email);
  }

  @Public()
  @Post('login')
  login(
    @Body() authLogin: AuthLoginDto,
    @Req() req: any,
    @Res({ passthrough: true }) res: any,
  ) {
    let sessionId = req.cookies['sessionId'];
    if (!sessionId) {
      sessionId = crypto.randomUUID();
    }
    res.setCookie('sessionId', sessionId, {
      expires: add(new Date(), { years: 1 }),
    });
    const ipAddress = req.clientIp;
    const userAgent = req.headers['user-agent'];

    return this.authService.login(authLogin, sessionId, ipAddress, userAgent);
  }

  @Public()
  @UseGuards(RefreshTokenGuard, CaslPoliciesGuard)
  @CheckPolicies(SessionManagePolicy())
  @Get('refresh')
  refresh(
    @Payload() payload: JwtPayloadWithRefreshToken,
    @Req() req: any,
    @Res({ passthrough: true }) res: any,
  ) {
    const sessionId = req.cookies['sessionId'];

    if (!sessionId) throw new ForbiddenException();

    res.setCookie('sessionId', sessionId, {
      expires: add(new Date(), { years: 1 }),
    });
    return this.authService.refreshTokens(
      payload.sub,
      payload.refreshToken,
      sessionId,
    );
  }

  @UseGuards(AccessTokenGuard)
  @Get('logout')
  logout(
    @Payload() payload: JwtPayload,
    @Req() req: any,
    @Res({ passthrough: true }) res: any,
  ) {
    const sessionId = req.cookies['sessionId'];

    res.clearCookie('sessionId', { path: '/auth' });

    return this.authService.logout(payload.sub, sessionId);
  }
}
