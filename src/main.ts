import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
const cookieSession = require('cookie-session'); //설정이 맞지 않아서 어쩔 수 없음.

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieSession({
    keys: ['asdf'],
  })); //쿠키 세션 미들웨어 추가
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
  })); //유효성 검사 파이프 추가
  await app.listen(3000);
}
bootstrap();
