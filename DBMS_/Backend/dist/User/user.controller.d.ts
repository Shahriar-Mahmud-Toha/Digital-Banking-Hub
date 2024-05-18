/// <reference types="multer" />
import { UserService } from "./user.service";
import { profileDTO } from './UserDTO/user.dto';
import { EmployeeEntity } from '../Employee/Entity/employee.entity';
import { transactionDto } from './UserDTO/user.transaction.dto';
import { TransactionEntity } from '../Employee/Entity/transaction.entity';
import { serviceDTO } from './UserDTO/user.service.dto';
export declare class UserController {
    private readonly userService;
    constructor(userService: UserService);
    getUser(): string;
    getUserProfilePictureById(userId: string, res: any, session: any): Promise<void>;
    getUsersByEmail(email: string): object;
    getUserProfile(session: any): object;
    getUserProfileAllInfo(session: any): object;
    deposit(myobj: transactionDto): Promise<{
        balance: number;
        transaction: TransactionEntity;
    }>;
    withdraw(myobj: transactionDto): Promise<{
        balance: number;
        transaction: TransactionEntity;
    }>;
    getUserInfoAndTransactions(session: any): Promise<{
        user: EmployeeEntity;
        transactions: TransactionEntity[];
    }>;
    makeRequest(session: any, myobj: serviceDTO, myFiles: Array<Express.Multer.File>): Promise<serviceDTO | string>;
    updateProfilePicture(session: any, myFiles: Array<Express.Multer.File>): Promise<{
        message: string;
    }>;
    deleteProfilePicture(session: any): Promise<{
        message: string;
    }>;
    getProfile(userId: string): Promise<EmployeeEntity[]>;
    getImages(name: string, res: any): void;
    getAll(): object;
    getUserAc(session: any): object;
    getUserAcc(userId: string): object;
    updateProfile(email: string, myobj: profileDTO): Promise<profileDTO | string>;
    getUserInfoAndTransaction(id: string): Promise<{
        user: EmployeeEntity;
        transactions: TransactionEntity[];
    }>;
}
