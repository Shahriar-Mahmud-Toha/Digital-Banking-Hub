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
import { Users } from 'src/Employee/Users.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Role,BaseSalary,AttendanceReports,SalarySheet,ProductKeys, Authentication, Users]),],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
