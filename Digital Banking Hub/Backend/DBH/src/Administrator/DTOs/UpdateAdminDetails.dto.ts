import { IsAlpha, IsDate, IsDateString, IsEmail, IsISO8601, IsIn, IsNotEmpty, IsNumberString, Length, Matches, isISO8601 } from "class-validator";
import { IsValidDate } from "../ValidDateChecker";
import { Transform } from "class-transformer";
export class UpdateAdminDetails{
    
    @IsNotEmpty({ message: 'FullName is required' })
    @Matches(/^[A-Za-z\s]+$/, { message: 'FullName must contain only English alphabets and spaces' })
    FullName: string;
    
    @IsNotEmpty()
    @IsIn(["male", "female"], { message: "Gender must be 'male' or 'female'" })
    Gender: string;
    
    @IsNotEmpty({ message: 'Date of Birth is required' })
    // @IsValidDate({ message: 'Invalid Date of Birth format' })
    @IsDateString()
    // @IsISO8601({ strict: true, strictSeparator: true })
    // @Transform(({ value }) => {
    //   const isValidDate = isISO8601(value, { strict: true, strictSeparator: true });
    //   if (!isValidDate) {
    //     throw new Error('Date of Birth should be a valid ISO8601 date format');
    //   }
    //   return new Date(value);
    // })
    @IsNotEmpty()
    DateOfBirth: Date;
    
    @IsNotEmpty({ message: 'NID is required' })
    @IsNumberString(undefined, { message: 'NID must contain only numbers' })
    NID: string;
    
    @IsNotEmpty({ message: 'Phone number is required' })
    @Matches(/^(017|016|013|019|018|015)\d{8}$/, { message: 'Invalid phone number format' })
    @Length(11, 11, { message: 'Phone number must be exactly 11 digits' })
    Phone: string;

    @IsNotEmpty({ message: 'Address is required' })
    Address: string;
}