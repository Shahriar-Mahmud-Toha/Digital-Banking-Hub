import { IsEmail, IsIn, IsNotEmpty, Length, Matches } from "class-validator";
export class adminSignup{
    
    @IsNotEmpty()
    @IsEmail({}, { message: "Invalid email format" }) 
    Email: string;

    @IsNotEmpty()
    @Length(6, undefined, { message: "Password must be at least 6 characters long" }) 
    @Matches(/^(?=.*[A-Z])/,{ message: "Password must contain at least one uppercase character" }) 
    Password: string;
    
    @IsNotEmpty()
    ActivationKey: string;
    
    // @IsNotEmpty()
    // @Length(4, undefined, { message: "Name must be at least 4 characters long" })
    // name:string;
    // @IsNotEmpty()
    // @IsIn(["male", "female"], { message: "Gender must be 'male' or 'female'" })
    // gender:string;
    // @IsNotEmpty()
    // @Matches(/^[0-9]+$/, { message: "Phone number must contain only numbers" })
    // phone: string;
}