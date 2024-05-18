import { Optional } from "@nestjs/common";
import { IsNumber, IsString, Matches, isNumber } from "class-validator";


export class transactionDto{

    transactionId: string;
    @Optional()
    accountNumber: number;


    amount: number;
    receiverAccount: number ;

    holderName: string;

    accountType: string;
   
    bankCode: number;
   
    routingNumber: number;
    
    transferType: string;
    Status: boolean;
}