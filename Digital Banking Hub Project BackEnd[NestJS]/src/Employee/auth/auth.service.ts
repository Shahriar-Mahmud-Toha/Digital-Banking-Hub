import { Injectable, UnauthorizedException } from '@nestjs/common';

import { JwtService } from '@nestjs/jwt';
import { EmployeeService } from '../employee.service';
import { loginDTO } from '../employee.dto';
import * as bcrypt from 'bcrypt';
import { Session } from 'express-session';

@Injectable()
export class AuthService {
  constructor(
    private employeeService: EmployeeService, 
    private jwtService: JwtService
  ) {}
  async signIn( logindata:loginDTO,session: Session): Promise<{ access_token: string }> {
    try {
      const user = await this.employeeService.findOne(logindata);
      if (!user) {
        throw new UnauthorizedException("This Account is Not Found");
      }
      if (user.isActive == false) {
        throw new UnauthorizedException("Your Account Is Not Active.");
      }
      const isMatch = await bcrypt.compare(logindata.password, user.password);
      if (!isMatch) {
        throw new UnauthorizedException("Please Give Valid Data");
      }
      const payload = { email: user.email, role: user.role };
      console.log('User Roles Service:', user.role);
      // Store data in session
      session['email'] = user.email;
      console.log(session['email']);
      return {
        access_token: await this.jwtService.signAsync(payload),
      };
    } catch (error) {
      // Here We Handle The Error 
      throw error;
    }
  }
}