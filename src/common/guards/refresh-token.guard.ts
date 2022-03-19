import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
@Injectable()
export class RefreshTokenGuard extends AuthGuard('refreshToken') {
  constructor() {
    super();
  }

  canActivate(context: ExecutionContext) {
    // const request = context.switchToHttp().getRequest();
    // console.log(request);

    return super.canActivate(context);
  }
}
