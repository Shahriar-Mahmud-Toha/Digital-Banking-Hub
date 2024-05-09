import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { EmployeeService } from '../Employee/employee.service';
import { UserService } from '../User/user.service';
import { loginDTO } from '../DTO/login.dto';
import * as bcrypt from 'bcrypt';
import { Session } from 'express-session';
import { RegistrationUserDto } from 'src/User/UserDTO/user.dto';
import { Authentication } from "./auth.entity";
import { Users } from 'src/CommonEntities/Users.entity';
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { UserEmailService } from "../User/UserMailer/mailer.sevice";
import { AccountEntity } from "../Employee/Entity/Account.entity";



@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private employeeService: EmployeeService,
    private jwtService: JwtService
  ) { }
  //    async signUp(myobj: RegistrationUserDto): Promise<RegistrationUserDto | string> {
        // const userRegistration = new  EmployeeEntity(); //use Users instead of EmployeeEntity
  //       userRegistration.userId = userRegistration.generateUserId();
  //       userRegistration.name = myobj.name;
  //       userRegistration.gender = myobj.gender;
  //       userRegistration.dob = myobj.dob;
  //       userRegistration.nid = myobj.nid;
  //       userRegistration.phone = myobj.phone;
  //       userRegistration.address = myobj.address;
  //       userRegistration.filename = myobj.filename;

  //       userRegistration.email = new Authentication();
  //       userRegistration.email.email = myobj.email;
  //       userRegistration.email.password = myobj.password;
  //       userRegistration.email.role = "User";
  //       userRegistration.email.isActive = true;



  //       const account = new AccountEntity();
  //       account.userId = userRegistration; // Assuming userId in AccountEntity is of type UserRegistrationEntity
  //       account.name = myobj.nomineeName;
  //       account.gender = myobj.nomineeGender;
  //       account.dob = myobj.nomineedob;
  //       account.nid = myobj.nomineenNid;
  //       account.phone = myobj.nomineephone;
  //       account.address = myobj.nomineeAddress;
  //       account.accountNumber = account.generateAccountNumber();
  //       account.filename = myobj.nomineeFilename;
  //       account.accountType=myobj.accountType;

  //       const existNID = await this.userRepository.findOneBy({ nid: userRegistration.nid });
  //       if (existNID) {
  //           return "This NID already exists";
  //       }
  //       const existEmail = await this.authRepository.findOneBy({ email: userRegistration.email.email });
  //       if (existEmail) {
  //           return "This Email already exists";
  //       }

  //       await this.userRepository.save(userRegistration);
  //       await this.authRepository.save(userRegistration.email);
  //       await this.accountRepository.save(account);

  //       const loginTime = new Date();
  //       const subject = "Welcome to IFSP BANK PLC";
  //       const body = "Your Account has been created at : " + loginTime ;

  //       await this.emailService.sendMail(myobj.email,subject,body);

  //       return myobj;

  //  }

  async signUp(myobj: RegistrationUserDto): Promise<RegistrationUserDto | string> {
    return await this.userService.addAccount(myobj);
  }
  async signIn(logindata: loginDTO, session: Session): Promise<{ access_token: string }> {
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