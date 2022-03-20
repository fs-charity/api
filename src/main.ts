import { CONFIG } from '@app/config';
import { Logger, ValidationPipe } from '@nestjs/common';
import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/filters';
import fastifyHelmet from 'fastify-helmet';
import { ClientIpMiddleWare } from './common/middlewares/client-ip.middleware';
import secureSession from 'fastify-secure-session';
async function bootstrap() {
  const fastify = new FastifyAdapter({ ignoreTrailingSlash: true });
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    fastify,
    {
      bufferLogs: true,
      logger: ['debug', 'error', 'verbose', 'warn'],
    },
  );

  await app.register(fastifyHelmet, {
    contentSecurityPolicy: {
      directives: {
        defaultSrc: [`'self'`],
        styleSrc: [`'self'`, `'unsafe-inline'`],
        imgSrc: [`'self'`, 'data:', 'validator.swagger.io'],
        scriptSrc: [`'self'`, `https: 'unsafe-inline'`],
      },
    },
  });

  app.enableCors({ origin: '*' });

  app.register(secureSession, {
    secret: 'averylogphrasebiggerthanthirtytwochars',
    salt: 'mq9hDxBVDbspDR6n',
  });

  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  const httpAdapter = app.get(HttpAdapterHost);
  app.useGlobalFilters(new AllExceptionsFilter(httpAdapter));

  app.register(ClientIpMiddleWare);
  await app.listen(CONFIG.apiServer.port);

  new Logger('Bootstrap').verbose(
    `Application is running on: ${await app.getUrl()}`,
  );
}
bootstrap();
