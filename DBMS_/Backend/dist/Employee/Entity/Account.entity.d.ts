import { EmployeeEntity } from "./employee.entity";
import { ServiceEntity } from "./service.entity";
export declare class AccountEntity {
    accountNumber: number;
    name: string;
    gender: string;
    dob: Date;
    nid: number;
    phone: string;
    address: string;
    filename: string;
    accountType: string;
    balance: number;
    accountStatus: boolean;
    generateAccountNumber(): number;
    userId: EmployeeEntity;
    services: ServiceEntity[];
}
