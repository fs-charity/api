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
    ses?: {
      accessKeyId: string;
      secretAccessKey: string;
      region: string;
    };
    transport?: {
      host: string;
      port: number;
      secure: boolean;
      auth: {
        user: string;
        pass: string;
      };
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
}
