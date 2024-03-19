import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import { Role } from './Role.entity';
import { SalarySheet } from './SalarySheet.entity';
import { ProductKeys } from './ProductKeys.entity';
import { BaseSalary } from './BaseSalary.entity';
import { AttendanceReports } from './AttendanceReports.entity';
import { Authentication } from 'src/Authentication/Authentication.entity';
import { Users } from 'src/Employee/Users.entity';

@Injectable()
export class AdminService {
    constructor(
        @InjectRepository(Role) private roleRepository: Repository<Role>,
        @InjectRepository(SalarySheet) private salarySheetRepository: Repository<SalarySheet>, 
        @InjectRepository(ProductKeys) private productKeysRepository: Repository<ProductKeys>, 
        @InjectRepository(BaseSalary) private baseSalaryRepository: Repository<BaseSalary>, 
        @InjectRepository(AttendanceReports) private attendanceReportsRepository: Repository<AttendanceReports>,
        @InjectRepository(Authentication) private authenticationRepository: Repository<Authentication>,
        @InjectRepository(Users) private usersRepository: Repository<Users>,
    ) { }
}
