import { BadRequestException, Body, ConflictException, Controller, Delete, Get, InternalServerErrorException, Param, Patch, Post, Put, Query, UsePipes, ValidationPipe } from "@nestjs/common";
import { AdminService } from "./admin.service";
import { UseInterceptors, UploadedFile }
    from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { MulterError, diskStorage } from "multer";
import { adminSignup } from "./DTOs/AdminSignup.dto";
import { AdminDetails } from "./DTOs/AdminDetails.dto";
import { randomBytes } from "crypto";
import { extname, join } from "path";
import { existsSync, mkdirSync, renameSync, unlinkSync } from 'fs';
import { submitOtp } from "./DTOs/submitOtp.dto";

const tempFolder = './uploads/admin/temp';
const storageFolder = './uploads/admin/storage';

@Controller('/admin')
export class AdminController {
    constructor(private readonly adminService: AdminService) { }

    //#region : Role
    @Post("/role/create")
    @UsePipes(new ValidationPipe)
    async CreateRole(@Body() data: Object): Promise<Object> {
        return {
            message: "Role Created Successfully",
            RoleID: await this.adminService.CreateRole(data["Name"])
        }
    }
    @Patch("/role/update/:id")
    @UsePipes(new ValidationPipe)
    async UpdateRole(@Param("id") id: string, @Body() data): Promise<Object> {
        let res = await this.adminService.updateRole(id, data["Name"]);
        if (!res) {
            return {
                message: "Role Not Updated.",
            }
        }
        else {
            return {
                message: "Role Updated Successfully.",
            }
        }
    }

    @Delete("/role/delete/:id")
    @UsePipes(new ValidationPipe)
    async DeleteRole(@Param("id") id: string): Promise<Object> {
        let res = await this.adminService.deleteRole(id);
        if (!res) {
            return {
                message: "This Role Cannot be Deleted.",
            }
        }
        else {
            return {
                message: "Role Deleted Successfully.",
            }
        }
    }
    @Get("/role/getall")
    @UsePipes(new ValidationPipe)
    async GetAllRoles(): Promise<Object> {
        return {
            message: "Operation Successful",
            data: await this.adminService.getAllRoles()
        }
    }
    //#endregion : Role

    //#region : Admin

    @Post("/signup")
    @UsePipes(new ValidationPipe)
    async SignupAdmin(@Body() data: adminSignup): Promise<Object> {
        const result = await this.adminService.signupAdmin(data);
        if (result == 1) {
            return {
                message: "OTP Sent to your email successfully. Submit OTP and complete signup process.",
            }
        }
        else if (result == -1) {
            throw new ConflictException('Email already exists');
        }
        else if (result == 0) {
            throw new BadRequestException('Invalid Activation Key');
        }
        else if (result == -3) {
            throw new InternalServerErrorException('OTP Not Sent');
        }
        else if (result == 2) {
            throw new InternalServerErrorException("Database Operation for Signup is Failed.");
        }
    }

    @Post("/signup/otpSubmit")
    @UsePipes(new ValidationPipe)
    async SubmitOtpForSignupAdmin(@Body() data: submitOtp): Promise<Object> {
        const result = await this.adminService.submitOtpForAdminSignup(data);
        if (result == 1) {
            return {
                message: "OTP Verified Successfully. Submit Account Details and complete signup process.",
            }
        }
        else if (result == 0) {
            throw new BadRequestException('OTP not Matched');
        }
        else if (result == -1) {
            throw new BadRequestException('No admin authentication data found associated with this email');
        }
        else if (result == -2) {
            throw new BadRequestException('No admin OTP data found associated with this email');
        }
        else if (result == -3) {
            throw new InternalServerErrorException("Database Operation for OTP verification is failed.");
        }
    }

    @Post("/provideDetails")
    @UsePipes(new ValidationPipe)
    @UseInterceptors(FileInterceptor('picture',
        {
            fileFilter: (req, file, cb) => {
                if (file.originalname.match(/^.*\.(jpg|png|jpeg)$/)) {
                    cb(null, true);
                } else {
                    cb(new MulterError('LIMIT_UNEXPECTED_FILE', 'image'), false);
                }
            },
            limits: { fileSize: 500000 },// 4 megabit
            storage: diskStorage({
                destination: tempFolder,
                filename: function (req, file, cb) {
                    const randomBytesBuffer = randomBytes(4);
                    let ranNum = parseInt(randomBytesBuffer.toString('hex'), 16) % 100000000; ////8 digit -> 10e8
                    const extension = extname(file.originalname);
                    cb(null, Date.now() + ranNum.toString() + extension)
                },
            })
        }))
    async insertAdminDetails(@Body() data: AdminDetails, @UploadedFile() picture: Express.Multer.File): Promise<Object> {
        try {
            const result = await this.adminService.findVerifiedAdminByEmail(data.Email);
            if (result == false) {
                throw new BadRequestException("No Admin found associated with this email.");
            }

            const user = await this.adminService.findAdminDetailsByEmail(data.Email);
            if (user != false) {
                throw new BadRequestException("Admin Details already exist.");
            }

            if (await this.adminService.insertAdminDetails(data, picture.filename)) {

                const sourcePath = join(tempFolder, picture.filename);
                const destinationPath = join(storageFolder, picture.filename);
                if (!existsSync(storageFolder)) {
                    mkdirSync(storageFolder, { recursive: true });
                }
                renameSync(sourcePath, destinationPath);

                return {
                    message: "Account Details Added Successfully."
                };
            } else {
                throw new InternalServerErrorException("Database Operation for Account Details Insertion is Failed.");
            }
        } catch (error) {
            // Delete the file if insertion fails
            await this.deleteTempPicture(picture.filename);
            throw error;
        }
    }
    async deleteTempPicture(filename: string): Promise<boolean> {
        const filePath = join(tempFolder, filename);
        if (existsSync(filePath)) {
            unlinkSync(filePath);
            return true;
        }
        return false;
    }

    //#endregion : Admin
}