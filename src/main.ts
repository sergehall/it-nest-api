import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );
  await app.listen(process.env.PORT || 5000, () => {
    console.log(`Example app listening on port: ${process.env.PORT || 5000}`);
  });
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
