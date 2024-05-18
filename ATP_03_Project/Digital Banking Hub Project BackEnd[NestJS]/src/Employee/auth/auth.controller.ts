import { Body, Controller, Post, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { loginDTO } from '../employee.dto';
import { Request } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
//=>[23]Login To The Website
  @Post('login')
  signIn(@Body() logindata: loginDTO, @Req() req: Request) {
    return this.authService.signIn(logindata,req.session);
  }
}