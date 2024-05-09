import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { TypeOrmModule } from "@nestjs/typeorm";
import { Role } from './Role.entity';
import { BaseSalary } from './BaseSalary.entity';
import { AttendanceReports } from './AttendanceReports.entity';
import { SalarySheet } from './SalarySheet.entity';
import { ProductKeys } from './ProductKeys.entity';
// import { Authentication } from 'src/Authentication/Authentication.entity';
import { Authentication } from 'src/Authentication/auth.entity';
import { Users } from 'src/CommonEntities/Users.entity';
import { adminSignup } from './DTOs/AdminSignup.dto';
import { AdminDetails } from './DTOs/AdminDetails.dto';
// import { MailerModule } from "@nestjs-modules/mailer";
import { AdminOTP } from './AdminOTP.entity';
import { submitOtp } from './DTOs/submitOtp.dto';
import { JwtModule } from '@nestjs/jwt';
import { adminAuthModule } from './Auth/adminAuth.module';
import { adminAuthService } from './Auth/adminAuth.service';
import { UpdateAdminDetails } from './DTOs/UpdateAdminDetails.dto';
import { UpdateAdminEmail } from './DTOs/UpdateAdminEmail.dto';
import { ForgetAdminPassword } from './DTOs/ForgetAdminPassword.dto';
import { AllocateSalary } from './DTOs/AllocateSalary.dto';
import { salarySheetGen } from './DTOs/salarySheetGen.dto';
import { LoginSessions } from 'src/CommonEntities/LoginSessions.entity';
// import nodemailer from 'nodemailer';
// const nodemailer = require('nodemailer');


@Module({
  imports: [adminSignup, AdminDetails,UpdateAdminDetails,UpdateAdminEmail,salarySheetGen,AllocateSalary, ForgetAdminPassword, submitOtp, TypeOrmModule.forFeature([Role, BaseSalary, AttendanceReports, SalarySheet, ProductKeys, Authentication, Users, AdminOTP, LoginSessions]),
    // JwtModule.register({
    //   global: true,
    //   secret: "3NP_Backend_Admin",
    //   signOptions: { expiresIn: '30m' },
    // }),
  ],
  controllers: [AdminController],
  providers: [AdminService, adminAuthService],
  exports: [AdminService],
})
export class AdminModule { }
