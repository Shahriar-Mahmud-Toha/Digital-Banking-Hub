import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as session from 'express-session';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Set up session middleware
  app.use(
    session({
      secret: 'my-secret',
      resave: false,
      saveUninitialized: false,
      cookie: {
        maxAge: 3600000
      }
    })
  );
  app.enableCors({
    origin:true,
    methods:'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials:true,
  });
  await app.listen(3001); 
  
}
bootstrap();
// function cookieParser(): any {
//   throw new Error('Function not implemented.');
// }

