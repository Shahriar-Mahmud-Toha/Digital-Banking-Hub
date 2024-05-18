import { Module } from "@nestjs/common";
import {EmployeeController} from "./employee.controller";
import { EmployeeService } from "./employee.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { EmployeeEntity } from "./Entity/employee.entity";
import { JwtModule } from "@nestjs/jwt/dist/jwt.module";
import { AuthService } from "../Authentication/auth.service";
import { AuthenticationEntity } from "../Authentication/auth.entity";
import { AccountEntity } from "./Entity/Account.entity";
import { TransactionEntity } from "./Entity/transaction.entity";
import { ServiceEntity } from "./Entity/service.entity";
import { MailerModule } from '@nestjs-modules/mailer';
import { EmailService } from "./Mailer/mailer.service";
import { UserService } from "src/User/user.service";
import { UserEmailService } from "src/User/UserMailer/mailer.sevice";
import { jwtConstants } from "src/Authentication/constants";



@Module({
    imports: [TypeOrmModule.forFeature([EmployeeEntity,AuthenticationEntity,AccountEntity,TransactionEntity,ServiceEntity],),
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '60m' },
    }),
    
  ],
    controllers:[EmployeeController],
    providers: [EmployeeService,AuthService,EmailService,UserService,UserEmailService],
    exports: [EmployeeService],
  })
  export class EmployeeModule {}