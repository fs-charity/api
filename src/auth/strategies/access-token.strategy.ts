import { CONFIG } from '@app/config';
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtPayload } from '../entity';

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(Strategy, 'at') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: CONFIG.security.accessTokenSecret,
    });
  }

  validate(payload: JwtPayload): JwtPayload {
    // console.log(payload);
    return payload;
  }
}
