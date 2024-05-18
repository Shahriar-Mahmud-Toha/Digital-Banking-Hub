import { AccountEntity } from "./Account.entity";
import { TransactionEntity } from "./transaction.entity";
import { AuthenticationEntity } from "../../Authentication/auth.entity";
export declare class EmployeeEntity {
    userId: string;
    name: string;
    gender: string;
    dob: Date;
    nid: number;
    phone: string;
    address: string;
    filename: string;
    generateId(): string;
    generateUserId(): string;
    email: AuthenticationEntity;
    Accounts: AccountEntity[];
    Transactions: TransactionEntity[];
}
