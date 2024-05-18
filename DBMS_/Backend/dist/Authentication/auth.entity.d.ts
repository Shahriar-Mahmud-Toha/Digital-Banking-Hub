import { EmployeeEntity } from "../Employee/Entity/employee.entity";
export declare class AuthenticationEntity {
    email: string;
    password: string;
    role: string;
    isActive: boolean;
    users: EmployeeEntity;
}
