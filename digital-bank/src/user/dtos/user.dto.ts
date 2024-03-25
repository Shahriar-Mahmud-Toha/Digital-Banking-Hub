import { Optional } from "@nestjs/common";
import { IsEmail, IsNotEmpty, IsNumberString, IsString, Matches, MaxLength, isEmail, isNotEmpty, isNumber } from "class-validator";
import { Entity } from "typeorm";


export class RegistrationUserDto{

    
    @Optional()
    userId:string;
      @IsNotEmpty()
  //  @MaxLength(150)
    name:string;
     @IsNotEmpty()

    @Matches(/^(male|female)$/i)
    gender:string;

    @IsNotEmpty()
    dob:string;

    @IsNotEmpty()
    @Matches(/^\d{8}(?:\d{8})?$/)
    nid:number;

    @IsNotEmpty()
   @Matches(/^01\d{9}$/)
    phone:number;

    @MaxLength(100)
    @IsEmail()
    email:string;

    @IsNotEmpty()
    address:string;
   
    filename: string;
   // @Optional()    isActive:boolean;
    @IsNotEmpty()
   // @Matches(/[A-Za-z\d!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]{8,}$/)
    password:string;

    @Optional()
    role:string;
    //isActive:boolean;


    @IsNotEmpty()
    nomineeName: string;



   @Matches(/^(male|female)$/i)
    nomineeGender: string;

    @IsNotEmpty()
    nomineedob: string;

    @IsNotEmpty()
    @Matches(/^\d{8}(?:\d{8})?$/)
    nomineenNid: number;

    @IsNotEmpty()
    @Matches(/^01\d{9}$/)
    nomineephone: string;

    @IsNotEmpty()
   nomineeAddress: string;
    
    nomineeFilename: string;

    @Matches(/^(current|saving)$/i)
    accountType: string;

   
    balance: number;

}
