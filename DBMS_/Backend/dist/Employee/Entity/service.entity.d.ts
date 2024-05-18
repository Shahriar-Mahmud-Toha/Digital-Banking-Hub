import { AccountEntity } from "./Account.entity";
export declare class ServiceEntity {
    serviceId: number;
    name: string;
    filename: string;
    status: boolean;
    applicationTime: Date;
    account: AccountEntity;
}
