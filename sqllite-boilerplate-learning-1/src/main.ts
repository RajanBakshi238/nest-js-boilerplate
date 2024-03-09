import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
const cookieSession = require('cookie-session');

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieSession({
    keys: ['asdfasfd']
  }))
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true  // this is used to stripe out all the properties comming i req body that are not mentioned in DTO file...
  }));
  await app.listen(3000);
}
bootstrap();
