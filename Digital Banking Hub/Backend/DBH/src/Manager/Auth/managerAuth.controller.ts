import { Body, Controller, Post, UsePipes, UseInterceptors, UploadedFile, ValidationPipe, UnauthorizedException, Get } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { MulterError, diskStorage } from 'multer';
import * as bcrypt from 'bcrypt';
import { managerAuthService } from './managerAuth.service';
import { managerLogin } from '../DTOs/ManagerLogin.dto';


@Controller('auth/manager')
export class managerAuthController {
    constructor(private managerAuthService: managerAuthService) { }
    
    @Post("/login")
    @UsePipes(new ValidationPipe)
    async loginManager(@Body() data: managerLogin): Promise<Object> {
        console.log("login data",data);

        const result = await this.managerAuthService.logIn(data);
        console.log(result)

        if (result == null) {
            throw new UnauthorizedException("Invalid Credentials !");
        }
        return {
            message: "Login Successful",
            token: result
        }
    }
}