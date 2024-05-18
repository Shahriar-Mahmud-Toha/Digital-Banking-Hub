import { RegistrationUserDto, profileDTO } from './UserDTO/user.dto';
import { EmployeeEntity } from '../Employee/Entity/employee.entity';
import { Repository } from 'typeorm';
import { AuthenticationEntity } from '../Authentication/auth.entity';
import { JwtService } from '@nestjs/jwt';
import { UserEmailService } from './UserMailer/mailer.sevice';
import { AccountEntity } from '../Employee/Entity/Account.entity';
import { TransactionEntity } from '../Employee/Entity/transaction.entity';
import { transactionDto } from './UserDTO/user.transaction.dto';
import { ServiceEntity } from '../Employee/Entity/service.entity';
import { serviceDTO } from './UserDTO/user.service.dto';
export declare class UserService {
    private userRepository;
    private jwtService;
    private emailService;
    private authRepository;
    private accountRepository;
    private tansactionRepository;
    private serviceRepository;
    constructor(userRepository: Repository<EmployeeEntity>, jwtService: JwtService, emailService: UserEmailService, authRepository: Repository<AuthenticationEntity>, accountRepository: Repository<AccountEntity>, tansactionRepository: Repository<TransactionEntity>, serviceRepository: Repository<ServiceEntity>);
    getUser(): string;
    addAccount(myobj: RegistrationUserDto): Promise<RegistrationUserDto | string>;
    getUserProfilePictureById(userId: string): Promise<{
        name: string;
        fileName: string;
    }>;
    getUserProfile(id: string): Promise<EmployeeEntity[]>;
    getUserProfileAllInfo(email: string): Promise<{
        user: EmployeeEntity;
        account: AccountEntity;
    } | string>;
    deposit(myobj: transactionDto): Promise<{
        balance: number;
        transaction: TransactionEntity;
    }>;
    withdraw(myobj: transactionDto): Promise<{
        balance: number;
        transaction: TransactionEntity;
    }>;
    getUserInfoAndTransactions(id: string): Promise<{
        user: EmployeeEntity;
        transactions: TransactionEntity[];
    }>;
    makeRequest(myobj: serviceDTO, session: any): Promise<serviceDTO | string>;
    updateUserProfilePicture(id: string, filename: string): Promise<void>;
    deleteUserProfilePicture(userId: string): Promise<void>;
    getProfile(id: string): Promise<EmployeeEntity[]>;
    getUsersByEmail(email: string): Promise<AuthenticationEntity>;
    getAllUsers(): Promise<EmployeeEntity[]>;
    getUserAc(id: string): Promise<EmployeeEntity[]>;
    updateProfile(userEmail: string, myobj: profileDTO): Promise<profileDTO | string>;
    getUserInfoAndTransaction(id: string): Promise<{
        user: EmployeeEntity;
        transactions: TransactionEntity[];
    }>;
}
