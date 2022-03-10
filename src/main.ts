import { CONFIG } from '@app/config';
import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  await app.listen(CONFIG.apiServer.port);

  new Logger('Bootstrap').verbose(
    `Application is running on: ${await app.getUrl()}`,
  );
}
bootstrap();
