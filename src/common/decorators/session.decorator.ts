import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { JwtPayload, JwtPayloadWithRefreshToken } from 'src/auth/entity';

// export const Session = createParamDecorator(
//   (data: unknown, ctx: ExecutionContext) => {
//     const request = ctx.switchToHttp().getRequest();
//     // console.log(request.user);
//     let payload: JwtPayload | JwtPayloadWithRefreshToken = {
//       sub: request.user.sub,
//       email: request.user.email,
//       refreshToken: request.user.refreshToken,
//       roles: request.user.roles,
//     };
//     return payload;
//   },
// );