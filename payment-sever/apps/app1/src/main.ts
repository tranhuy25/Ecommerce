import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    snapshot: true,
    abortOnError: false,
    bufferLogs: true,
  });

  app.enableCors(); // Enable CORS for all origins

  const configService = app.get(ConfigService);
  const port = configService.getOrThrow('PORT');

  await app.listen(port);
}
bootstrap();
