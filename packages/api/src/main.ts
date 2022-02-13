import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import proxy from 'express-http-proxy';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use('/corsproxy', proxy('http://localhost:8080'));

  await app.listen(3000);
}
bootstrap().then(() => console.log('Nest app started'));
