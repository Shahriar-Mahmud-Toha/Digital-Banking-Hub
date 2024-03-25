import { Module } from "@nestjs/common";
import {EmployeeController} from "./employee.controller";
import { EmployeeService } from "./employee.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { EmployeeEntity } from "./Entity/employee.entity";
import { JwtModule } from "@nestjs/jwt/dist/jwt.module";
import { AuthService } from "./auth/auth.service";
import { AuthenticationEntity } from "./auth/auth.entity";
import { AccountEntity } from "./Entity/Account.entity";
import { TransactionEntity } from "./Entity/transaction.entity";
import { ServiceEntity } from "./Entity/service.entity";
import { MailerModule } from '@nestjs-modules/mailer';
import { EmailService } from "./Mailer/mailer.service";



@Module({
    imports: [TypeOrmModule.forFeature([EmployeeEntity,AuthenticationEntity,AccountEntity,TransactionEntity,ServiceEntity],),
    JwtModule.register({
      global: true,
      secret: "3NP_Backend_Admin",
      signOptions: { expiresIn: '60m' },
    }),
    
  ],
    controllers:[EmployeeController],
    providers: [EmployeeService,AuthService,EmailService],
    exports: [EmployeeService],
  })
  export class EmployeeModule {}