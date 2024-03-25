import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRegistrationEntity } from './entitys/user.entity';
import { AuthenticationEntity } from './entitys/auth.entity';
import { secret } from './auth/constants';
import { JwtModule } from '@nestjs/jwt';
import { EmailService } from './mailer/mailer.sevice';
import { AuthService } from './auth/auth.service';
import { AuthController } from './auth/auth.controller';
import { AccountEntity } from './entitys/accountInfo.entity';
import { TransactionEntity } from './entitys/transaction.entity';
import { ServiceEntity } from './entitys/services.entity';
import { SessionModule } from 'nestjs-session';
//import { AuthService } from './auth/auth.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserRegistrationEntity,
      AuthenticationEntity,
      AccountEntity,
      TransactionEntity,
      ServiceEntity,
    ]),
    JwtModule.register({
      global: true,
      secret: "3NP_Backend_Admin",
      signOptions: { expiresIn: '30m' },
    }),
    SessionModule.forRoot({
      session: { secret: 'your-secret-key' },
    }), // Import and configure SessionModule
  ],
 controllers: [UserController,AuthController],
//  controllers: [UserController],
  providers:[ UserService,EmailService,AuthService],
  exports: [UserService],
})
export class UserModule {}



// @Module({
//   imports: [ TypeOrmModule.forFeature([UserRegistrationEntity,AuthenticationEntity]), 
//   JwtModule.register({
//     global: true,
//     secret: "3NP_Backend_Admin",
//     signOptions: { expiresIn: '30m' },
//   }),],
//   controllers: [UserController,AuthController],
//   providers: [UserService,EmailService,AuthService]
// })
// export class UserModule {}
