// main.ts
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,          // strips properties that do not have decorators
      forbidNonWhitelisted: true, // throws error if extra props are present
      transform: true,          // auto-transforms payloads to correct types
    }),
  );
  await app.listen(3000);
}
bootstrap();
