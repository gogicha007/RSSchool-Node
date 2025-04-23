import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { LoggingService } from './logging/logging.service';
import { LoggingInterceptor } from './logging.interceptor';
import * as dotenv from 'dotenv';
import { CatchEvenythingFilter } from './http-exception.filter';

dotenv.config();

const PORT = Number(process.env.PORT) || 4000;

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });

  const config = new DocumentBuilder()
    .setTitle('Home Library Service')
    .setDescription('Home library service')
    .setVersion('1.0')
    .build();

  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('doc', app, documentFactory);

  app.useGlobalPipes(
    new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }),
  );
  app.useGlobalInterceptors(new LoggingInterceptor(new LoggingService()));
  app.useGlobalFilters(new CatchEvenythingFilter(new LoggingService()));
  app.useLogger(app.get(LoggingService));

  await app.listen(PORT);
}

bootstrap();
