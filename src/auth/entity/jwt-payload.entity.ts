import { Role } from '@prisma/client';

export class JwtPayload {
  email: string;
  sub: number;
  roles: Role[];
}

export class JwtPayloadWithRefreshToken extends JwtPayload {
  refreshToken: string;
}
