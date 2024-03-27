import { Body, Controller, Post, UsePipes, UseInterceptors, UploadedFile, ValidationPipe, UnauthorizedException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { MulterError, diskStorage } from 'multer';
import * as bcrypt from 'bcrypt';
import { managerAuthService } from './managerAuth.service';
import { managerLogin } from '../DTOs/ManagerLogin.dto';
@Controller('/auth/manager')
export class managerAuthController {
    constructor(private managerAuthService: managerAuthService) { }
    @Post("/login")
    @UsePipes(new ValidationPipe)
    async loginManager(@Body() data: managerLogin): Promise<Object> {
        const result = await this.managerAuthService.logIn(data);
        if (result == null) {
            throw new UnauthorizedException("Invalid Credentials !");
        }
        return {
            message: "Login Successful",
            token: result
        }
    }
}