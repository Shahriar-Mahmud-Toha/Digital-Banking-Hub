import { Body, Controller, Post, UsePipes, UseInterceptors, UploadedFile, ValidationPipe, UnauthorizedException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { MulterError, diskStorage } from 'multer';
import * as bcrypt from 'bcrypt';
import { adminAuthService } from './adminAuth.service';
import { adminLogin } from '../DTOs/AdminLogin.dto';
@Controller('/auth/admin')
export class adminAuthController {
    constructor(private adminAuthService: adminAuthService) { }
    @Post("/login")
    @UsePipes(new ValidationPipe)
    async loginAdmin(@Body() data: adminLogin): Promise<Object> {
        const result = await this.adminAuthService.logIn(data);
        if (result == null) {
            throw new UnauthorizedException("Invalid Credentials !");
        }
        return {
            message: "Login Successful",
            token: result
        }
    }
}