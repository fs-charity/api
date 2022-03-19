export class JwtPayload {
  email: string;
  sub: number;
}

export class JwtPayloadWithRefreshToken extends JwtPayload {
  refreshToken: string;
}
