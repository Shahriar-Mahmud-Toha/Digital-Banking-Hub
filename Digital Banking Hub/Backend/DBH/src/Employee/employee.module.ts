import { Module } from "@nestjs/common";
import { EmployeeController } from "./employee.controller";
import { EmployeeService } from "./employee.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { JwtModule } from "@nestjs/jwt/dist/jwt.module";
import { AuthService } from "../Authentication/auth.service";
import { Authentication } from "../Authentication/auth.entity";
import { AccountEntity } from "./Entity/Account.entity";
import { TransactionEntity } from "./Entity/transaction.entity";
import { ServiceEntity } from "./Entity/service.entity";
import { EmailService } from "./Mailer/mailer.service";
import { UserService } from "src/User/user.service";
import { UserEmailService } from "src/User/UserMailer/mailer.sevice";
import { jwtConstants } from "src/Authentication/constants";
import { Users } from "src/CommonEntities/Users.entity";
import { AdminService } from "src/Administrator/admin.service";
import { AdminModule } from "src/Administrator/admin.module";



@Module({
  imports: [AdminModule, TypeOrmModule.forFeature([Users, Authentication, AccountEntity, TransactionEntity, ServiceEntity],),
  JwtModule.register({
    global: true,
    secret: jwtConstants.secret,
    signOptions: { expiresIn: '60m' },
  }),

  ],
  controllers: [EmployeeController],
  providers: [EmployeeService, AuthService, EmailService, UserService, UserEmailService],
  exports: [EmployeeService],
})
export class EmployeeModule { }