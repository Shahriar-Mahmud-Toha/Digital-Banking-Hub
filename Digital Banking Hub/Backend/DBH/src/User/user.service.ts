import { Injectable, NotFoundException, Patch, UnauthorizedException, ValidationPipe } from '@nestjs/common';
import { RegistrationUserDto } from './UserDTO/user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Transaction } from 'typeorm';
import { Authentication } from '../Authentication/auth.entity';
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
import { Users } from 'src/CommonEntities/Users.entity';
import { AdminService } from 'src/Administrator/admin.service';

@Injectable()
export class UserService {

  constructor(@InjectRepository(Users) private userRepository: Repository<Users>,
    private jwtService: JwtService,
    private emailService: UserEmailService,
    @InjectRepository(Authentication) private authRepository: Repository<Authentication>,
    @InjectRepository(AccountEntity) private accountRepository: Repository<AccountEntity>,
    @InjectRepository(TransactionEntity) private tansactionRepository: Repository<TransactionEntity>,
    @InjectRepository(ServiceEntity) private serviceRepository: Repository<ServiceEntity>,
    private readonly adminService: AdminService,
  ) { }

  getUser(): string {
    return "hello";
  }

  async addAccount(myobj: RegistrationUserDto): Promise<RegistrationUserDto | string> {
    const userRegistration = new Users();
    userRegistration.userId = userRegistration.generateUserId();
    userRegistration.FullName = myobj.name;
    userRegistration.Gender = myobj.gender;
    userRegistration.DOB = myobj.dob;
    userRegistration.NID = myobj.nid;
    userRegistration.Phone = myobj.phone;
    userRegistration.Address = myobj.address;
    userRegistration.FileName = myobj.filename;

    userRegistration.Authentication = new Authentication();
    userRegistration.Authentication.Email = myobj.email;
    userRegistration.Authentication.Password = myobj.password;
    userRegistration.Authentication.RoleID = await this.adminService.getRoleIdByName("user");
    userRegistration.Authentication.Active = true;



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
    account.accountType = myobj.accountType;

    const existNID = await this.userRepository.findOneBy({ NID: userRegistration.NID });
    if (existNID) {
      return "This NID already exists";
    }
    const existEmail = await this.authRepository.findOneBy({ Email: userRegistration.Authentication.Email });
    if (existEmail) {
      return "This Email already exists";
    }

    await this.userRepository.save(userRegistration);
    await this.authRepository.save(userRegistration.Authentication);
    await this.accountRepository.save(account);

    const loginTime = new Date();
    const subject = "Welcome to IFSP BANK PLC";
    const body = "Your Account has been created at : " + loginTime;

    await this.emailService.sendMail(myobj.email, subject, body);

    return myobj;

  }

  ////---1 Get profile pic 

  async getUserProfilePictureById(userId: string): Promise<{ name: string; fileName: string }> {
    const user = await this.userRepository.findOne({ select: { FileName: true, FullName: true }, where: { userId: userId } });
    if (!user || !user.FileName) {
      throw new NotFoundException('User profile picture not found');
    }
    return { name: user.FullName, fileName: user.FileName };

  }


  ///---2 User profile
  async getUserProfile(id: string): Promise<Users[]> {
    // return this.userRepository.find({select:{name:true,gender:true},
    // where:[{userId:id}]})
    return this.userRepository.find({ where: { userId: id } });
  }

  //--3 get user profile all info one to one relation
  async getUserProfileAllInfo(email: string): Promise<{ user: Users; account: AccountEntity } | string> {
    try {
      const userInfo = await this.authRepository.findOne({ where: { Email: email }, relations: ['User'] });
      const userid = userInfo.User.userId;
      const user = await this.userRepository.findOne({ where: { userId: userid }, relations: ['Accounts'] });


      console.log(email);

      if (!email) {
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

  async deposit(myobj: transactionDto): Promise<{ balance: number, transaction: TransactionEntity }> {
    console.log("Attempting to insert/update database with account number:", myobj.accountNumber);
    console.log("Withdraw amount:", myobj.amount);

    if (isNaN(myobj.amount)) {
      throw new Error('Amount is not a valid number');
    }




    const user = await this.accountRepository.findOne({
      where: { accountNumber: myobj.accountNumber }, relations: ['userId'],
    });



    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Ensure sufficient balance
    if (myobj.amount < 0) {
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

  async withdraw(myobj: transactionDto): Promise<{ balance: number, transaction: TransactionEntity }> {
    console.log("Attempting to insert/update database with account number:", myobj.accountNumber);
    console.log("Withdraw amount:", myobj.amount);

    if (isNaN(myobj.amount)) {
      throw new Error('Amount is not a valid number');
    }

    const user = await this.accountRepository.findOne({
      where: { accountNumber: myobj.accountNumber }, relations: ['userId'],
    });


    if (!user) {
      throw new NotFoundException('User not found');
    }
    console.log(user);

    // Ensure sufficient balance
    if (user.balance < myobj.amount) {
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

  async getUserInfoAndTransactions(id: string): Promise<{ user: Users; transactions: TransactionEntity[] }> {
    const user = await this.userRepository.findOne({ where: { userId: id } });

    const transactions = await this.tansactionRepository.find({
      relations: ['userId'],
    });


    return { user, transactions };
  }


  ///--7 Request for services


  async makeRequest(myobj: serviceDTO, session): Promise<serviceDTO | string> {


    const user = await this.accountRepository.findOne({
      where: { accountNumber: myobj.accountNumber }, relations: ['userId'],
    });


    if (!user) {
      throw new NotFoundException('User not found');
    }




    const Service = new ServiceEntity();
    // Service.serviceId =Service.generateId();
    Service.name = myobj.name;
    Service.filename = myobj.filename;
    Service.applicationTime = new Date();
    Service.status = true;

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
  async updateUserProfilePicture(id: string, filename: string): Promise<void> {
    const user = await this.userRepository.findOneBy({ userId: id });
    if (!user) {
      throw new Error('User not found');
    }
    user.FileName = filename; // Assuming the User entity has a profilePicture field
    await this.userRepository.save(user);
  }





  /////Experiment


  async deleteUserProfilePicture(userId: string): Promise<void> {
    const user = await this.userRepository.findOneBy({ userId });
    if (!user) {
      throw new Error('User not found');
    }
    if (user.FileName) {
      const filePath = path.join('./upload', user.FileName);
      fs.unlink(filePath, (err) => {
        if (err) {
          console.error('Failed to delete local file', err);
        }
      });
    }
    user.FileName = null; // Remove the filename from the user's record
    await this.userRepository.save(user);
  }



}


