import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from '@/app.module';
import { ValidationPipe } from '@nestjs/common';

const bootstrap = async () => {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  console.log('Application is running on port:', process.env.PORT ?? 3000);
  await app.listen(process.env.PORT ?? 3000);
};

void bootstrap();
