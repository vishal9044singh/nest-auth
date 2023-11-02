import { NestFactory } from '@nestjs/core';
import { Logger, ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });

  app.use(helmet());

  app.useGlobalPipes(new ValidationPipe({ transform: true, stopAtFirstError: true }));

  await app.listen(process.env.AUTH_PORT);
  Logger.log(`App is listening on  port: ${process.env.AUTH_PORT}`);
}

bootstrap();
