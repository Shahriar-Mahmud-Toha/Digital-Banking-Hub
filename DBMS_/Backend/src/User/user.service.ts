import { Injectable, NotFoundException, Patch, UnauthorizedException, ValidationPipe } from '@nestjs/common';
import { RegistrationUserDto, profileDTO } from './UserDTO/user.dto';
import {EmployeeEntity } from '../Employee/Entity/employee.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Transaction } from 'typeorm';
import { AuthenticationEntity } from '../Authentication/auth.entity';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { loginDTO } from '../DTO/login.dto';
import { UserEmailService } from './UserMailer/mailer.sevice';
import session, { Session } from 'express-session';
import { AccountEntity } from '../Employee/Entity/Account.entity';
import { TransactionEntity } from '../Employee/Entity/transaction.entity';
import { transactionDto } from './UserDTO/user.transaction.dto';
import { ServiceEntity } from '../Employee/Entity/service.entity';
import { serviceDTO } from './UserDTO/user.service.dto';
import path from 'path';
import * as fs from 'fs';

@Injectable()
export class UserService {

    constructor(@InjectRepository(EmployeeEntity) private userRepository: Repository<EmployeeEntity>,
    private jwtService: JwtService,
    private emailService:UserEmailService,
    @InjectRepository(AuthenticationEntity) private authRepository: Repository<AuthenticationEntity>, 
    @InjectRepository(AccountEntity) private accountRepository: Repository<AccountEntity>,
    @InjectRepository(TransactionEntity) private tansactionRepository: Repository<TransactionEntity>, 
    @InjectRepository(ServiceEntity) private serviceRepository: Repository<ServiceEntity>) {}

    getUser():string{
        return"hello";
    }

    async addAccount(myobj: RegistrationUserDto): Promise<RegistrationUserDto | string> {
      const userRegistration = new  EmployeeEntity();
      userRegistration.userId = userRegistration.generateUserId();
      userRegistration.name = myobj.name;
      userRegistration.gender = myobj.gender;
      userRegistration.dob = myobj.dob;
      userRegistration.nid = myobj.nid;
      userRegistration.phone = myobj.phone;
      userRegistration.address = myobj.address;
      userRegistration.filename = myobj.filename;
      
      userRegistration.email = new AuthenticationEntity();
      userRegistration.email.email = myobj.email;
      userRegistration.email.password = myobj.password;
      userRegistration.email.role = "User";
      userRegistration.email.isActive = true;

    

      const account = new AccountEntity();
      account.userId = userRegistration; // Assuming userId in AccountEntity is of type UserRegistrationEntity
      account.name = myobj.nomineeName;
      account.gender = myobj.nomineeGender;
      account.dob = myobj.nomineedob;
      account.nid = myobj.nomineenNid;
      account.phone = myobj.nomineephone;
      account.address = myobj.nomineeAddress;
      account.accountNumber = account.generateAccountNumber();
      account.filename = myobj.nomineeFilename;
      account.accountType=myobj.accountType;

      const existNID = await this.userRepository.findOneBy({ nid: userRegistration.nid });
      if (existNID) {
          return "This NID already exists";
      }
      const existEmail = await this.authRepository.findOneBy({ email: userRegistration.email.email });
      if (existEmail) {
          return "This Email already exists";
      }

      await this.userRepository.save(userRegistration);
      await this.authRepository.save(userRegistration.email);
      await this.accountRepository.save(account);

      const loginTime = new Date();
      const subject = "Welcome to IFSP BANK PLC";
      const body = "Your Account has been created at : " + loginTime ;
  
      await this.emailService.sendMail(myobj.email,subject,body);

      return myobj;

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
  async getUserProfile(id:string):Promise<EmployeeEntity[]>{
    // return this.userRepository.find({select:{name:true,gender:true},
    // where:[{userId:id}]})
     return this.userRepository.find({ where: {userId: id}});
   }

   //--3 get user profile all info one to one relation
  async getUserProfileAllInfo (email:string): Promise<{ user: EmployeeEntity; account: AccountEntity } | string> {
    try {
      const userInfo = await this.authRepository.findOne({ where: { email: email }, relations: ['users'] });
      const userid = userInfo.users.userId;
      const user = await this.userRepository.findOne({ where: { userId: userid }, relations: ['Accounts'] });

  
      console.log(email);
  
      if(!email){
        return 'Log in first';
      }
  
      if (!user) {
        return 'User not found';
      }
  
      return {
        user,
        account: user.Accounts[1], // Assuming each user has only one associated account
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
  transaction.transactionStatus = myobj.Status;
  transaction.accountType = myobj.accountType;
  transaction.acountNumber = myobj.accountNumber;
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
  transaction.transactionStatus = myobj.Status;
  transaction.accountType = myobj.accountType;
  transaction.acountNumber = myobj.accountNumber;
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

async getUserInfoAndTransactions(id: string): Promise<{ user: EmployeeEntity; transactions: TransactionEntity[] }> {
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



async getProfile(id:string):Promise<EmployeeEntity[]>{
  // return this.userRepository.find({select:{name:true,gender:true},
  // where:[{userId:id}]})
   return this.userRepository.find({ where: {userId: id}});
 }


 async  getUsersByEmail(email:string): Promise<AuthenticationEntity> {
  const result = await this.authRepository.findOne({
      where: {
          email: email,
      },relations:['users']
  });
  console.log (result);
  return result;

}



async getAllUsers(): Promise<EmployeeEntity[]> {
  return await this.userRepository.find();
}


async getUserAc(id:string):Promise<EmployeeEntity[]>{
  // return this.userRepository.find({select:{name:true,gender:true},
  // where:[{userId:id}]})
   return this.userRepository.find({ where: {userId: id},relations:['Accounts']});
 }


 
 async updateProfile(userEmail: string, myobj: profileDTO): Promise<profileDTO | string> {
  try {
      const account = await this.authRepository.findOne({ where: { email: userEmail }, relations: ['users'] });

      if (!account) {
          throw new NotFoundException('User not found');
      }

      const User = new EmployeeEntity();
      User.userId = account.users.userId;
      User.name = myobj.name;
      User.phone = myobj.phone;
      User.address = myobj.address;

      User.email = new AuthenticationEntity();
      User.email.email = account.email;
      User.email.password = account.password;      
      

      // if (account.userId.userId !== myobj.userId) {
      //     return "UserID Cannot be Changed";
      // }
      console.log(myobj.email);
      console.log("AC MAIL"+account.email);
      if (account.users.userId !== myobj.userId) {
          return "user id Cannot be ";
      }


      await this.userRepository.save(User);
      await this.authRepository.save(User.email);

      const updatedInfo = await this.authRepository.findOne({ where: { email: userEmail }, relations: ['users'] });
      const userInfo = new profileDTO();
      const date = new Date(updatedInfo.users.dob);

      const formattedDate = date.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: '2-digit',
      });
      userInfo.userId = updatedInfo.users.userId;
      userInfo.name = updatedInfo.users.name;
     
      userInfo.phone = updatedInfo.users.phone;
      userInfo.address = updatedInfo.users.address;
      userInfo.email = updatedInfo.email;
      return userInfo;
  } catch (error) {
      // Here We Handle The Error 
      throw new Error("Error occurred while updating user profile.");
  }
}




async getUserInfoAndTransaction(id: string): Promise<{ user: EmployeeEntity; transactions: TransactionEntity[] }> {
  const user = await this.userRepository.findOne({ where: { userId: id } });
  
  const transactions = await this.tansactionRepository.find({ 
    relations: ['userId'],
  });

  
  return { user, transactions };
}



}


