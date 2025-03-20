import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { json, urlencoded } from 'express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: process.env.NODE_ENV === 'development' ? '*' : process.env.CLIENT,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.use(json({ limit: '50mb' }));
  app.use(urlencoded({ extended: true, limit: '50mb' }));

  const config = new DocumentBuilder()
    .setTitle('Swagger Ecommerce')
    .setDescription(
      '🛍️ Online Shopping Website | E-Commerce Platform\n' +
        '👋 Welcome to Online Shopping Website, an e-commerce platform that makes shopping easy, fast, and convenient. ' +
        'We offer a wide range of products, from fashion, electronics, home appliances, beauty to modern technology gadgets, ' +
        'all at affordable prices with exciting discounts.',
    )
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api', app, document, {
    swaggerOptions: {
      url: '/api-json',
      deepLinking: true, // Cho phép truy cập trực tiếp bằng URL #/
      displayRequestDuration: true,
    },
  });

  await app.listen(process.env.APP_PORT);
}

bootstrap();
