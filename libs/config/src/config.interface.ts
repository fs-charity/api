export enum ENVIRONMENT {
  PRODUCTION,
  DEVELOPMENT,
}

export interface Configuration {
  environment: ENVIRONMENT;

  apiServer: {
    port: number | string;
  };

  security: {
    accessTokenSecret: string;
    accessTokenExpiry: string;
    refreshTokenSecret: string;
    refreshTokenExpiry: string;
    cookieSecret: string;
  };

  email: {
    name: string;
    from: string;
    retries: number;
    ses: {
      accessKeyId: string;
      secretAccessKey: string;
      region: string;
    };
  };

  s3: {
    accessKeyId: string;
    secretAccessKey: string;
    region: string;
    profilePictureBucket?: string;
    profilePictureCdnHostname?: string;
  };

  logger: {
    enable: boolean;
  };

  project: {
    name: string;
    address: string;
    logoUrl: string;
    slogan: string;
    socials: Array<string[]>;
    homeUrl: string;
    mailVerificationUrl: string;
    mailChangeUrl: string;
    resetPasswordUrl: string;
    termsOfServiceUrl: string;
  };

  theme: {
    color: string;
  };
}
