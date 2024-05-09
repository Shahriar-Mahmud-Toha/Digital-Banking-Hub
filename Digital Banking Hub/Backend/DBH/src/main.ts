import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import session from 'express-session';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(
    session({
      secret: 'j32y#TR&%H',
      resave: false,
      saveUninitialized: false,
      cookie: {
        maxAge: 900000 // -> Milliseconds = 15 minutes
      }
    }),
  );

  app.enableCors({
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });
  await app.listen(4000);
}
bootstrap();
