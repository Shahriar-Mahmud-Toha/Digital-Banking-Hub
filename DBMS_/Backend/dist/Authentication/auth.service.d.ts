import { JwtService } from '@nestjs/jwt';
import { EmployeeService } from '../Employee/employee.service';
import { UserService } from '../User/user.service';
import { loginDTO } from '../DTO/login.dto';
import { Session } from 'express-session';
import { RegistrationUserDto } from 'src/User/UserDTO/user.dto';
export declare class AuthService {
    private userService;
    private employeeService;
    private jwtService;
    constructor(userService: UserService, employeeService: EmployeeService, jwtService: JwtService);
    signUp(myobj: RegistrationUserDto): Promise<RegistrationUserDto | string>;
    signIn(logindata: loginDTO, session: Session): Promise<{
        access_token: string;
    }>;
}
