import {
  CaslPoliciesGuard,
  CheckPolicies,
  SessionManagePolicy,
} from '@app/casl';
import {
  Body,
  ConsoleLogger,
  Controller,
  Get,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Payload } from 'src/common/decorators';
import { Public } from 'src/common/decorators/public.decorator';

import { AccessTokenGuard } from 'src/common/guards/access-token.guard';
import { RefreshTokenGuard } from 'src/common/guards/refresh-token.guard';

import { AuthService } from './auth.service';
import { AuthLoginDto } from './dto/auth-login.dto';
import { JwtPayload, JwtPayloadWithRefreshToken } from './entity';
import * as crypto from 'crypto';
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('login')
  login(@Body() authLogin: AuthLoginDto, @Req() req: any) {
    const sessionId = req.session.get('sessionId');
    if (!sessionId) {
      req.session.set('sessionId', crypto.randomUUID());
    }
    const ipAddress = req.clientIp;
    const userAgent = req.headers['user-agent'];
    return this.authService.login(authLogin, sessionId, ipAddress, userAgent);
  }

  @Public()
  @UseGuards(RefreshTokenGuard, CaslPoliciesGuard)
  @CheckPolicies(SessionManagePolicy())
  @Get('refresh')
  refresh(@Payload() payload: JwtPayloadWithRefreshToken, @Req() req: any) {
    const sessionId = req.session.get('sessionId');
    const ipAddress = req.clientIp;
    const userAgent = req.headers['user-agent'];

    return this.authService.refreshTokens(
      payload.sub,
      payload.refreshToken,
      sessionId,
      ipAddress,
      userAgent,
    );
  }

  @UseGuards(AccessTokenGuard)
  @Get('logout')
  logout(@Payload() payload: JwtPayload) {
    return this.authService.logout(payload.sub, 'session');
  }
}
