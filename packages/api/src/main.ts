import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import proxy from 'express-http-proxy';

// process.env.VI

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(process.env.CLIENT_CORS_PATH, proxy(process.env.CORS_URL));

  await app.listen(process.env.SERVER_PORT);
}
bootstrap().then(() => console.log('Nest app started'));
