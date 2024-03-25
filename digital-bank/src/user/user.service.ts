import { Injectable, NotFoundException, Patch, UnauthorizedException, ValidationPipe } from '@nestjs/common';
import { RegistrationUserDto } from './dtos/user.dto';
import { UserRegistrationEntity } from './entitys/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Transaction } from 'typeorm';
import { AuthenticationEntity } from './entitys/auth.entity';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { loginDTO } from './dtos/user.logIn.dto';
import { EmailService } from './mailer/mailer.sevice';
import session, { Session } from 'express-session';
import { AccountEntity } from './entitys/accountInfo.entity';
import { TransactionEntity } from './entitys/transaction.entity';
import { transactionDto } from './dtos/user.transaction.dto';
import { ServiceEntity } from './entitys/services.entity';
import { serviceDTO } from './dtos/user.service.dto';
import path from 'path';
import * as fs from 'fs';

@Injectable()
export class UserService {

    constructor(@InjectRepository(UserRegistrationEntity) private userRepository: Repository<UserRegistrationEntity>, private jwtService: JwtService,private emailService:EmailService,
    @InjectRepository(AuthenticationEntity) private authRepository: Repository<AuthenticationEntity>, @InjectRepository(AccountEntity) private accountRepository: Repository<AccountEntity>,@InjectRepository(TransactionEntity) private tansactionRepository: Repository<TransactionEntity>, @InjectRepository(ServiceEntity) private serviceRepository: Repository<ServiceEntity>) {}

    


    getUser():string{
        return"hello";
    }

 

////---1 Get profile pic 

async getUserProfilePictureById(userId: string): Promise<{ name: string; fileName: string }> {
  const user = await this.userRepository.findOne({ select: { filename: true , name: true }, where: { userId: userId } });
  if (!user || !user.filename) {
     throw new NotFoundException('User profile picture not found');
  }
  return { name: user.name, fileName: user.filename };

}


  ///---2 User profile
  async getUserProfile(id:string):Promise<UserRegistrationEntity[]>{
    // return this.userRepository.find({select:{name:true,gender:true},
    // where:[{userId:id}]})
     return this.userRepository.find({ where: {userId: id}});
   }

   //--3 get user profile all info one to one relation
  async getUserProfileAllInfo (id:string): Promise<{ user: UserRegistrationEntity; account: AccountEntity } | string> {
    try {
      const user = await this.userRepository.findOne({ where: { userId: id }, relations: ['accounts'] });
  
      console.log(id);
  
      if(!id){
        return 'Log in first';
      }
  
      if (!user) {
        return 'User not found';
      }
  
      return {
        user,
        account: user.accounts[1], // Assuming each user has only one associated account
      };
    } catch (error) {
      console.error('Error retrieving user profile:', error);
      return 'Error retrieving user profile';
    }
  }
  
    


///4---deposit money

async deposit(myobj: transactionDto): Promise<{balance: number, transaction: TransactionEntity}> {
  console.log("Attempting to insert/update database with account number:", myobj.accountNumber);
  console.log("Withdraw amount:", myobj.amount);

  if (isNaN(myobj.amount)) {
    throw new Error('Amount is not a valid number');
  }




const user = await this.accountRepository.findOne({ where: { accountNumber: myobj.accountNumber }, relations: ['userId'],
}); 


 
  if (!user) {
    throw new NotFoundException('User not found');
  }

  // Ensure sufficient balance
  if( myobj.amount<0){
    throw new Error('Enter a valid amount: ' + user.balance);
  }

  // Prepare transaction entity
  const transaction = new TransactionEntity();
 // transaction.transactionId = Transaction.generateId(); // Make sure this method exists and correctly generates an ID.
  transaction.Status = myobj.Status;
  transaction.accountType = myobj.accountType;
  transaction.accountNumber = myobj.accountNumber;
  transaction.amount = myobj.amount;
  transaction.bankCode = myobj.bankCode;
  transaction.holderName = myobj.holderName;
  transaction.receiverAccount = myobj.receiverAccount;
  transaction.routingNumber = myobj.routingNumber;
  transaction.transferType = myobj.transferType;

  user.balance += myobj.amount;
  transaction.userId = user.userId;
  console.log(user.gender);
  console.log(transaction.userId);
  console.log(user.userId);

  

  
  await this.accountRepository.save(user);
  await this.tansactionRepository.save(transaction);
 
  return {
    balance: user.balance,
    transaction: transaction
  };
}







//--5 Withdraw money

async withdraw(myobj: transactionDto): Promise<{balance: number, transaction: TransactionEntity}> {
  console.log("Attempting to insert/update database with account number:", myobj.accountNumber);
  console.log("Withdraw amount:", myobj.amount);

  if (isNaN(myobj.amount)) {
    throw new Error('Amount is not a valid number');
  }

  const user = await this.accountRepository.findOne({ where: { accountNumber: myobj.accountNumber }, relations: ['userId'],
}); 

 
  if (!user) {
    throw new NotFoundException('User not found');
  }
  console.log(user);

  // Ensure sufficient balance
  if(user.balance < myobj.amount){
    throw new NotFoundException('Insufficient balance for withdrawal. Current balance is: ' + user.balance);
  }

  // Prepare transaction entity
  const transaction = new TransactionEntity();
 // transaction.transactionId = Transaction.generateId(); // Make sure this method exists and correctly generates an ID.
  transaction.Status = myobj.Status;
  transaction.accountType = myobj.accountType;
  transaction.accountNumber = myobj.accountNumber;
  transaction.amount = myobj.amount;
  transaction.bankCode = myobj.bankCode;
  transaction.holderName = myobj.holderName;
  transaction.receiverAccount = myobj.receiverAccount;
  transaction.routingNumber = myobj.routingNumber;
  transaction.transferType = myobj.transferType;

  user.balance -= myobj.amount;
  transaction.userId = user.userId;
  

  
  await this.accountRepository.save(user);
  await this.tansactionRepository.save(transaction);
 
  return {
    balance: user.balance,
    transaction: transaction
  };
}

///--6  transection One to many

async getUserInfoAndTransactions(id: string): Promise<{ user: UserRegistrationEntity; transactions: TransactionEntity[] }> {
  const user = await this.userRepository.findOne({ where: { userId: id } });
  
  const transactions = await this.tansactionRepository.find({ 
    relations: ['userId'],
  });

  
  return { user, transactions };
}


///--7 Request for services


async makeRequest(myobj: serviceDTO,session): Promise<serviceDTO | string> {


  const user = await this.accountRepository.findOne({ where: { accountNumber: myobj.accountNumber }, relations: ['userId'],
}); 

 
  if (!user) {
    throw new NotFoundException('User not found');
  }



    
  const Service = new ServiceEntity();
 // Service.serviceId =Service.generateId();
  Service.name=myobj.name;
  Service.filename=myobj.filename;
  Service.applicationTime=new Date();
  Service.status =true;

  Service.account = new AccountEntity();

  Service.account.accountNumber = myobj.accountNumber;

  

  //console.log(data);




  await this.serviceRepository.save(Service);

 // console.log(myobj);

  return myobj; 

}




// async getUserTransactions(userId: string): Promise<TransactionEntity[]> {
//   return this.tansactionRepository.find({
//     relations: ['userId']
//   });
// }

///---8 Update user Profile Pic
async updateUserProfilePicture(id:string, filename: string): Promise<void> {
  const user = await this.userRepository.findOneBy({ userId: id });
  if (!user) {
    throw new Error('User not found');
  }
  user.filename = filename; // Assuming the User entity has a profilePicture field
  await this.userRepository.save(user);
}





/////Experiment


async deleteUserProfilePicture(userId: string): Promise<void> {
  const user = await this.userRepository.findOneBy({ userId });
  if (!user) {
    throw new Error('User not found');
  }
  if (user.filename) {
    const filePath = path.join('./upload', user.filename);
    fs.unlink(filePath, (err) => {
      if (err) {
        console.error('Failed to delete local file', err);
      }
    });
  }
  user.filename = null; // Remove the filename from the user's record
  await this.userRepository.save(user);
}






}


