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

  await app.listen(3000);
}
bootstrap();
