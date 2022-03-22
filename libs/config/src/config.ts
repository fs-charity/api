import * as dotenv from 'dotenv';
import { Configuration, ENVIRONMENT } from './config.interface';

dotenv.config();

const int = (val: string | undefined, num: number): number =>
  val ? (isNaN(parseInt(val)) ? num : parseInt(val)) : num;
const bool = (val: string | undefined, bool: boolean): boolean =>
  val == null ? bool : val == 'true';

export const CONFIG: Configuration = {
  environment:
    process.env.ENVIRONMENT == 'production'
      ? ENVIRONMENT.PRODUCTION
      : ENVIRONMENT.DEVELOPMENT,
  apiServer: {
    port: process.env.API_SERVER_PORT ?? 3000,
  },
  security: {
    accessTokenSecret: process.env.ACCESS_TOKEN_SECRET ?? 'AccessTokenSecret',
    accessTokenExpiry: process.env.ACCESS_TOKEN_EXPIRY ?? '15m',
    refreshTokenSecret:
      process.env.REFRESH_TOKEN_SECRET ?? 'RefreshTokenSecret',
    refreshTokenExpiry: process.env.REFRESH_TOKEN_EXPIRY ?? '7d',
    cookieSecret: process.env.COOKIE_SECRET ?? 'CookieSecret',
  },
  email: {
    name: process.env.EMAIL_NAME ?? 'Charity App',
    from: process.env.EMAIL_FROM ?? 'farhan.webdev@gmail.com',
    retries: int(process.env.EMAIL_FAIL_RETRIES, 3),
    ses: {
      accessKeyId: process.env.EMAIL_SES_ACCESS_KEY_ID ?? '',
      secretAccessKey: process.env.EMAIL_SES_SECRET_ACCESS_KEY ?? '',
      region: process.env.EMAIL_SES_REGION ?? 'us-east-1',
    },
  },
  s3: {
    accessKeyId: process.env.AWS_S3_ACCESS_KEY ?? '',
    secretAccessKey: process.env.AWS_S3_SECRET_KEY ?? '',
    region: process.env.AWS_S3_REGION ?? 'us-east-1',
    profilePictureBucket: process.env.AWS_S3_PROFILE_PICTURE_BUCKET ?? '',
    profilePictureCdnHostname:
      process.env.AWS_S3_PROFILE_PICTURE_CDN_HOST_NAME ?? '',
  },

  logger: {
    enable: bool(process.env.LOGGER_ENABLE, false),
  },
  project: {
    name: 'Charity App',
    address: '',
    logoUrl: '#',
    slogan: '',
    socials: [],
    homeUrl: '#',
    mailVerificationUrl: 'http://localhost:3000/auth/verify',
    mailChangeUrl: 'http://localhost:3000/auth/change-email',
    resetPasswordUrl: '#',
    termsOfServiceUrl: '',
  },
  theme: {
    color: '#123456',
  },
};
