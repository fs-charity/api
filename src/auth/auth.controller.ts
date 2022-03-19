import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { Payload } from 'src/common/decorators';
import { Public } from 'src/common/decorators/public.decorator';

import { AccessTokenGuard } from 'src/common/guards/access-token.guard';
import { RefreshTokenGuard } from 'src/common/guards/refresh-token.guard';

import { AuthService } from './auth.service';
import { AuthLoginDto } from './dto/auth-login.dto';
import { JwtPayload, JwtPayloadWithRefreshToken } from './entity';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('login')
  login(@Body() authLogin: AuthLoginDto) {
    return this.authService.login(authLogin);
  }

  @Public()
  @UseGuards(RefreshTokenGuard)
  @Get('refresh')
  refresh(@Payload() payload: JwtPayloadWithRefreshToken) {
    return this.authService.refreshTokens(payload.sub, payload.refreshToken);
  }
}
