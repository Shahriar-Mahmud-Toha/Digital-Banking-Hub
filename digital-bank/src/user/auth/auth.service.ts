import { Injectable, UnauthorizedException } from "@nestjs/common";
import { AuthenticationEntity } from "../entitys/auth.entity";
import { UserRegistrationEntity } from "../entitys/user.entity";
import { RegistrationUserDto } from "../dtos/user.dto";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { JwtService } from "@nestjs/jwt";
import { EmailService } from "../mailer/mailer.sevice";
import { loginDTO } from "../dtos/user.logIn.dto";
import * as bcrypt from 'bcrypt';
import { AccountEntity } from "../entitys/accountInfo.entity";
import session from "express-session";


@Injectable()
export class AuthService {
    constructor(@InjectRepository(UserRegistrationEntity) private userRepository: Repository<UserRegistrationEntity>, private jwtService: JwtService,private emailService:EmailService,
    @InjectRepository(AuthenticationEntity) private authRepository: Repository<AuthenticationEntity>, @InjectRepository(AccountEntity) private accountRepository: Repository<AccountEntity>) {}

 async createAccount(myobj: RegistrationUserDto): Promise<RegistrationUserDto | string> {
    
        const Authentication = new AuthenticationEntity();
        Authentication.email = myobj.email;
        Authentication.password = myobj.password;
        Authentication.role = "User";
        Authentication.isActive = true;

        const userRegistration = new UserRegistrationEntity();
        userRegistration.userId = userRegistration.generateId();
        userRegistration.name = myobj.name;
        userRegistration.gender = myobj.gender;
        userRegistration.dob = myobj.dob;
        userRegistration.NID = myobj.nid;
        userRegistration.phone = myobj.phone;
        userRegistration.address = myobj.address;
        userRegistration.filename = myobj.filename;

        Authentication.userId = userRegistration;
       

        const account = new AccountEntity();
        account.userId = userRegistration; // Assuming userId in AccountEntity is of type UserRegistrationEntity
        account.name = myobj.nomineeName;
        account.gender = myobj.nomineeGender;
        account.dob = myobj.nomineedob;
        account.nid = myobj.nomineenNid;
        account.phone = myobj.nomineephone;
        account.address = myobj.nomineeAddress;
        account.accountNumber = account.generateAccountNumber();
        account.filename = myobj.nomineeFilename;
        account.accountType=myobj.accountType;

        const existNID = await this.userRepository.findOneBy({ NID: userRegistration.NID });
        if (existNID) {
            return "This NID already exists";
        }
        const existEmail = await this.authRepository.findOneBy({ email: Authentication.email });
        if (existEmail) {
            return "This Email already exists";
        }

        await this.userRepository.save(userRegistration);
        await this.authRepository.save(Authentication);
        await this.accountRepository.save(account);

        const loginTime = new Date();
        const subject = "Welcome to IFSP BANK PLC";
        const body = "Your Account has been created at : " + loginTime ;
     
         await this.emailService.sendMail(myobj.email,subject,body);

        return myobj;
   
}


async signIn(loginData: loginDTO ): Promise<{ access_token: string }> {
    const user = await this.findOne(loginData);
    if (!user) {
      throw new UnauthorizedException("Not match");
     
    }

    const isMatch = await bcrypt.compare(loginData.password, user.password);
    const value = await this.findUid(loginData);

   
   

    if (!isMatch) {
      throw new UnauthorizedException();
   
    }
  

    const loginTime = new Date();

   const loginDto = new loginDTO();
   const subject = "Log in Occured";
   const body = "Log in Occured at : "+loginTime;

    await this.emailService.sendMail(loginData.email,subject,body);
   
  //  console.log(loginData.email);
    
  
  const payload = loginData;

   
    return {
        
    access_token: await this.jwtService.signAsync(payload),
    };
  }

   async findOne( logindata:loginDTO): Promise<any> {
    return await this.authRepository.findOneBy({email:logindata.email});
   
  }
  async findUid(logindata: loginDTO): Promise<any > {
    const value = await this.authRepository.findOne({
      where: {
          email: logindata.email
      },
      relations: ['userId'],
  });
  const result = value.userId.userId;

  return result;
  }


    
}