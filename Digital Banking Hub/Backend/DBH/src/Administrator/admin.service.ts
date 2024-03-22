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
import { adminSignup } from './DTOs/AdminSignup.dto';
import { AdminDetails } from './DTOs/AdminDetails.dto';
import { parse } from 'date-fns';
import { randomBytes } from 'crypto';
import { AdminOTP } from './AdminOTP.entity';
import { Console } from 'console';
import path from 'path';
import * as fs from 'fs';
import authInfo from "./MailConfig/info.json"
import { submitOtp } from './DTOs/submitOtp.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
const nodemailer = require('nodemailer');

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
        @InjectRepository(AdminOTP) private adminOTPRepository: Repository<AdminOTP>,
        private jwtService: JwtService
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
    async getRoleIdByName(name: string): Promise<string> {
        let exData = await this.roleRepository.find({
            where: { Name: name.toLowerCase() }
        });
        if (exData.length > 0) {
            return exData[0].Id;
        }
        return null;
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

    //#region : Admin
    async signupAdmin(data: adminSignup): Promise<Number> {
        try {
            let exData = await this.authenticationRepository.find({
                where: { Email: data.Email }
            });
            if (exData.length > 0) {
                return -1; //already exist
            }
            if (await this.ProductKeyMatched(data.ActivationKey) == false) {
                return 0; // Invalid Product Key
            }
            if (await this.sendOTP(data.Email) == false) {
                return -3; // OTP Not Sent
            }
            //hashing password
            const salt = await bcrypt.genSalt();
            data.Password = await bcrypt.hash(data.Password, salt); 

            await this.authenticationRepository.save(await this.AdminSignupDTOtoAuthentication(data));
            return 1; //success
        } catch (error) {
            console.error('Error while Creating Admin:', error);
            return -2;
        }
    }
    async sendOTP(receiverEmail: string): Promise<boolean> {
        let flag = false;
        try {
            const randomBytesBuffer = randomBytes(4);
            let ranNum = parseInt(randomBytesBuffer.toString('hex'), 16) % 100000000; //8 digit -> 10e8
            // console.log("1");
            let otpData: AdminOTP;
            let exData = await this.adminOTPRepository.find({
                where: { Email: receiverEmail }
            });
            // console.log("2");
            if (exData.length > 0) {
                otpData = exData[0];
                otpData.Otp = ranNum.toString();
                otpData.Verified = false;
                // console.log("3");
            }
            else {
                otpData = new AdminOTP();
                otpData.Email = receiverEmail;
                otpData.Otp = ranNum.toString();
                otpData.Verified = false;
                // console.log("4");
            }
            // console.log("4.5");
            let cData = await this.adminOTPRepository.save(otpData);
            // console.log("5");
            if (cData == null) {
                return false;
            }
            const transporter = nodemailer.createTransport({
                host: 'smtp-mail.outlook.com',
                port: 587,
                auth: {
                    user: authInfo.email,
                    pass: authInfo.password
                }
            });

            const mailOptions = {

                from: authInfo.email,
                to: receiverEmail,
                subject: 'Digital Banking Hub - OTP verification',
                text: "OTP: " + ranNum
            };

            await new Promise((resolve, reject) => {
                transporter.sendMail(mailOptions, function (error, info) {
                    if (error) {
                        reject(error);
                        // console.log("6");
                    } else {
                        // console.log("7");
                        flag = true;
                        resolve(info.response);
                    }
                });
            });
            // console.log("8");
            return flag;
        } catch (error) {
            console.error('Error while sending OTP:', error);
            // console.log("9");
            return false;
        }
    }
    async submitOtpForAdminSignup(data: submitOtp): Promise<Number> {
        try {
            let user = await this.findAdminByEmail(data.email);
            if (user == null) {
                return -1; //User not found in auth table
            }
            let exOtpData = await this.adminOTPRepository.find({
                where: { Email: data.email }
            });
            if (exOtpData.length == 0) {
                return -2; //User not found in OTP table
            }
            if (exOtpData[0].Otp != null && exOtpData[0].Otp == data.otp) {
                exOtpData[0].Verified = true;
                exOtpData[0].Otp = null;
                await this.adminOTPRepository.save(exOtpData);
                return 1; //OTP verified
            }
            return 0; //invalid OTP
        }
        catch (error) {
            return -3; //Database related error
        }
    }
    async AdminSignupDTOtoAuthentication(data: adminSignup): Promise<Authentication> {
        let newData = new Authentication();
        newData.Email = data.Email;
        newData.Password = data.Password;
        newData.Active = false;
        newData.RoleID = await this.CreateRole("admin");
        return newData;
    }
    async ProductKeyMatched(key: string): Promise<boolean> {
        let flag = false;
        const exData = await this.productKeysRepository.find({
            where: {
                Key: key
            }
        })
        flag = exData.length > 0;
        //#region : Delete Product Key
        // if (flag) {
        //     try {
        //         await this.productKeysRepository.remove(exData[0]);
        //     }
        //     catch (error) {
        //         flag = false; // error
        //     }
        // }
        //#endregion: Delete Product Key
        return flag;
    }
    async findAdminByEmail(email: string): Promise<Authentication | boolean> {
        try {
            let exData = await this.authenticationRepository.find({
                where: { Email: email, RoleID: await this.getRoleIdByName("admin") }
            });
            if (exData.length == 0) {
                return false; //Admin not found
            }
            return exData[0];
        }
        catch (error) {
            console.log(error);
            return false;
        }
    }
    async findVerifiedAdminByEmailForAuth(email: string): Promise<Authentication | null> {
        try {
            let exData = await this.authenticationRepository.find({
                where: { Email: email, RoleID: await this.getRoleIdByName("admin"), Active: true}
            });
            if (exData.length == 0) {
                return null; //Admin not found
            }
            return exData[0];
        }
        catch (error) {
            // console.log(error);
            return null;
        }
    }
    async findVerifiedAdminByEmail(email: string): Promise<Authentication | boolean> {
        try {
            let exData = await this.authenticationRepository.find({
                where: { Email: email, RoleID: await this.getRoleIdByName("admin") }
            });
            if (exData.length == 0) {
                return false; //Admin not found
            }
            let exOtpData = await this.adminOTPRepository.find({
                where: { Email: email, Verified: true }
            });
            if (exOtpData.length == 0) {
                return false; //Admin not verified
            }
            return exData[0];
        }
        catch (error) {
            console.log(error);
            return false;
        }
    }
    async findAdminDetailsByEmail(email: string): Promise<Users | boolean> {
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
    async insertAdminDetails(data: AdminDetails, fileName: string): Promise<boolean> {
        try {
            let cData = await this.usersRepository.save(await this.AdminDetailsDTOtoUser(data, fileName));
            let adminData = await this.authenticationRepository.find({
                where: { Email: data.Email, RoleID: await this.getRoleIdByName("admin") }
            });
            adminData[0].Active = true;
            let res = await this.authenticationRepository.save(adminData[0]);
            return res != null; //success
        } catch (error) {
            console.error('Error while Creating Admin:', error);
            return false;
        }
    }
    async AdminDetailsDTOtoUser(data: AdminDetails, fileName: string): Promise<Users> {
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
    async deleteAdmin(email: string): Promise<boolean> {
        try {
            let userData = await this.usersRepository.find({
                where: { Email: email }
            });
            let adminData = await this.authenticationRepository.find({
                where: { Email: email, RoleID: await this.getRoleIdByName("admin") }
            });
            if (userData.length == 0 || adminData.length == 0) {
                return false;
            }
            if(await this.authenticationRepository.remove(adminData) == undefined){
                return false;
            }
            const filePath = path.join(__dirname,'../..', 'uploads', 'admin', 'storage', userData[0].FileName);
            if (fs.existsSync(filePath)) {
                try {
                    fs.unlinkSync(filePath);
                } catch (error) {
                    // console.error('Error deleting file:', error);
                    return false;
                }
            }
            return true;
        }
        catch (error) {
            // console.log(error);
            return false;
        }
    }
    //#endregion : Admin
}
