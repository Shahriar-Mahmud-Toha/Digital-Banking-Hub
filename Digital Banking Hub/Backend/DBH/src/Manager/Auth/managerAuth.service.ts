import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { ManagerService } from '../manager.service';
import { managerLogin } from '../DTOs/ManagerLogin.dto';

@Injectable()
export class managerAuthService {
    constructor(
        private managerService: ManagerService,
        private jwtService: JwtService
    ) { }

    async logIn(loginData: managerLogin): Promise<string> {
        try {
            const adminData = await this.managerService.findVerifiedManagerByEmailForAuth(loginData.Email);
            //console.log(adminData);
            if (adminData == null) {
                return null;
            }
            const isMatch = await bcrypt.compare(loginData.Password, adminData.Password);
            //console.log(isMatch);
            //console.log(loginData.Password);
            if (!isMatch) {
                return null;
            }
            const payload = {
                email:adminData.Email,
                role:adminData.RoleID
            }
            return await this.jwtService.signAsync(payload);
        }
        catch (error) {
            console.log(error);
            return null;
        }
    }
}