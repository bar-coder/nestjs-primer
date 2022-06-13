import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true // it excludes all the fields not declared in the corresponding DTO to be processed inside the controller
    })
  );
  await app.listen(3333);
}
bootstrap();
