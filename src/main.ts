import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { CONFIG } from 'config/config';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(CONFIG['api-server'].port);

  new Logger('Bootstrap').verbose(
    `Application is running on: ${await app.getUrl()}`,
  );
}
bootstrap();
