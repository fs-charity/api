import { CONFIG } from '@app/config';
import { Logger, ValidationPipe } from '@nestjs/common';
import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/filters';

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

  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  const httpAdapter = app.get(HttpAdapterHost);
  app.useGlobalFilters(new AllExceptionsFilter(httpAdapter));

  await app.listen(CONFIG.apiServer.port);

  new Logger('Bootstrap').verbose(
    `Application is running on: ${await app.getUrl()}`,
  );
}
bootstrap();
