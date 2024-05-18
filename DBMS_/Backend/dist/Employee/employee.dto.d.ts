export declare class EmployeeDTO {
    userId: number;
    name: string;
    gender: string;
    dob: Date;
    nid: number;
    phone: string;
    email: string;
    address: string;
    filename: string;
    isActive: boolean;
    password: string;
    role: string;
}
export declare class profileDTO {
    userId: string;
    name: string;
    gender: string;
    dob: string;
    nid: number;
    phone: string;
    email: string;
    address: string;
    filename: string;
    role: string;
}
export declare class changePasswordDTO {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
}
