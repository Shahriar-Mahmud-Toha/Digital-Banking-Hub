import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import { Role } from './Role.entity';
import { SalarySheet } from './SalarySheet.entity';
import { ProductKeys } from './ProductKeys.entity';
import { BaseSalary } from './BaseSalary.entity';
import { AttendanceReports } from './AttendanceReports.entity';
import { Authentication } from 'src/Authentication/Authentication.entity';
import { Users } from 'src/CommonEntities/Users.entity';

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

    //#region : Role
    async CreateRole(name: string): Promise<string> {
        try {
            let exData = await this.roleRepository.find({
                where: { Name: name.toLowerCase() }
            });
            if (exData.length > 0) {
                return exData[0].Id;
            }
            let data = new Role();
            data.Name = name.toLowerCase();
            let cData = await this.roleRepository.save(data);
            return cData.Id;
        } catch (error) {
            console.error('Error while Creating role:', error);
            return "-1";
        }
    }
    async updateRole(id: string, newName: string): Promise<boolean> {
        const existingRole = await this.roleRepository.find({
            where: {
                Id: id
            }
        })

        if (existingRole.length == 0) {
            return false;
        }

        existingRole[0].Name = newName.toLowerCase();
        try {
            await this.roleRepository.save(existingRole[0]);
            return true;
        } catch (error) {
            console.error('Error while updating role:', error);
            return false;
        }
    }

    async deleteRole(id: string): Promise<boolean> {
        const existingRole = await this.roleRepository.find({
            where: {
                Id: id
            }
        })

        if (existingRole.length == 0) {
            return false;
        }
        try {
            await this.roleRepository.remove(existingRole[0]);
            return true;
        } catch (error) {
            console.error('This Role Cannot Be Deleted. Error:', error);
            return false;
        }
    }
    async getAllRoles(): Promise<Role[]> {
        return await this.roleRepository.find();
    }

    //#endregion : Role
}
