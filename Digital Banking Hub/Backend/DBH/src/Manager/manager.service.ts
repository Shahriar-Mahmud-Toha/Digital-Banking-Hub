import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import { Authentication } from 'src/Authentication/Authentication.entity';
import { Users } from 'src/CommonEntities/Users.entity';
import { JwtService } from '@nestjs/jwt';
import { AdminService } from 'src/Administrator/admin.service';
import { ManagerDetails } from './DTOs/ManagerDetails.dto';
import { add, parse } from 'date-fns';

@Injectable()
export class ManagerService {
    constructor(
        @InjectRepository(Authentication) private authenticationRepository: Repository<Authentication>,
        @InjectRepository(Users) private usersRepository: Repository<Users>,
        private readonly adminService:AdminService,
        private jwtService: JwtService
    ) { }

    async findVerifiedManagerByEmailForAuth(email: string): Promise<Authentication | null> {
        try {
            let exData = await this.authenticationRepository.find({
                where: { Email: email, RoleID: await this.adminService.getRoleIdByName("manager"), Active: true }
            });
            // console.log(exData);
            if (exData.length == 0) {
                return null; //manager not found
            }
            return exData[0];
        }
        catch (error) {
            // console.log(error);
            return null;
        }
    }
    async findManagerDetailsByEmail(email: string): Promise<Users | boolean> {
        try {
            let exData = await this.usersRepository.find({
                where: { Email: email }
            });
            if (exData.length == 0) {
                return false; //User not found
            }
            return exData[0];
        }
        catch (error) {
            console.log(error);
            return false;
        }
    }
    async insertManagerDetails(data: ManagerDetails, fileName: string): Promise<boolean> {
        try {
            let cData = await this.usersRepository.save(await this.ManagerDetailsDTOtoUser(data, fileName));
            let managerData = await this.authenticationRepository.find({
                where: { Email: data.Email, RoleID: await this.adminService.getRoleIdByName("manager") }
            });
            managerData[0].Active = true;
            let res = await this.authenticationRepository.save(managerData[0]);
            return res != null; //success
        } catch (error) {
            console.error('Error while Creating Manager:', error);
            return false;
        }
    }
    async ManagerDetailsDTOtoUser(data: ManagerDetails, fileName: string): Promise<Users> {
        let newData = new Users();
        newData.Email = data.Email;
        newData.FullName = data.FullName;
        newData.FileName = fileName;
        newData.DOB = parse(data.DateOfBirth.toString(), 'dd-MM-yyyy', new Date());
        newData.Gender = data.Gender;
        newData.NID = data.NID;
        newData.Phone = data.Phone;
        newData.Address = data.Address;
        return newData;
    }
}
