import { EmployeeEntity } from "./employee.entity";
export declare class TransactionEntity {
    transactionId: string;
    acountNumber: number;
    amount: number;
    receiverAccount: number;
    holderName: string;
    accountType: string;
    bankCode: number;
    routingNumber: number;
    transferType: string;
    transactionStatus: boolean;
    applicationTime: Date;
    generateId(): string;
    userId: EmployeeEntity;
}
