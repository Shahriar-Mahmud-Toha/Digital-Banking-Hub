/// <reference types="multer" />
import { AuthService } from './auth.service';
import { loginDTO } from '../DTO/login.dto';
import { Request } from 'express';
import { RegistrationUserDto } from 'src/User/UserDTO/user.dto';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    createAccount(myobj: RegistrationUserDto, myFiles: Express.Multer.File[]): Promise<RegistrationUserDto | string>;
    signIn(logindata: loginDTO, req: Request): Promise<{
        access_token: string;
    }>;
}
