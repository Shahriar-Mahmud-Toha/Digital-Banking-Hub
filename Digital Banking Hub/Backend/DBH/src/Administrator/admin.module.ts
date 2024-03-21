import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { TypeOrmModule } from "@nestjs/typeorm";
import { Role } from './Role.entity';
import { BaseSalary } from './BaseSalary.entity';
import { AttendanceReports } from './AttendanceReports.entity';
import { SalarySheet } from './SalarySheet.entity';
import { ProductKeys } from './ProductKeys.entity';
import { Authentication } from 'src/Authentication/Authentication.entity';
import { Users } from 'src/CommonEntities/Users.entity';
import { adminSignup } from './DTOs/AdminSignup.dto';
import { AdminDetails } from './DTOs/AdminDetails.dto';
// import { MailerModule } from "@nestjs-modules/mailer";
import { AdminOTP } from './AdminOTP.entity';
import { submitOtp } from './DTOs/submitOtp.dto';
// import nodemailer from 'nodemailer';
// const nodemailer = require('nodemailer');


@Module({
  imports: [adminSignup, AdminDetails, submitOtp, TypeOrmModule.forFeature([Role, BaseSalary, AttendanceReports, SalarySheet, ProductKeys, Authentication, Users, AdminOTP]), 
  ],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule { }
