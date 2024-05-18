import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { EmployeeDTO, changePasswordDTO, loginDTO,profileDTO } from "./employee.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Like, Repository } from "typeorm";
import { AuthenticationEntity } from "./auth/auth.entity";
import { EmployeeEntity } from "./Entity/employee.entity";
import { JwtService } from '@nestjs/jwt';
//import { emit } from "process";
import * as bcrypt from 'bcrypt';
import { AccountEntity } from "./Entity/Account.entity";
import { EmailService } from "./Mailer/mailer.service";
import { TransactionEntity } from "./Entity/transaction.entity";
import { ServiceEntity } from "./Entity/service.entity";

@Injectable()
export class EmployeeService {
    [x: string]: any;
    constructor(@InjectRepository(EmployeeEntity) private employeeRepo: Repository<EmployeeEntity>,
    @InjectRepository(AuthenticationEntity) private autheRepo: Repository<AuthenticationEntity>,
    @InjectRepository(AccountEntity) private accountRepo: Repository<AccountEntity>,
    @InjectRepository(TransactionEntity) private transactionRepo: Repository<TransactionEntity>,
    @InjectRepository(ServiceEntity) private serviceRepo: Repository<ServiceEntity>,
    private jwtService: JwtService,
    private emailService:EmailService

  ) { }
    getUsers(): object {
        return { message: "hellow Admin" }
    }
    
    async createAccount(myobj: EmployeeDTO): Promise<EmployeeDTO | string> {
        try {
            const Authentication = new AuthenticationEntity();
            Authentication.email=myobj.email;
            Authentication.password=myobj.password;
            Authentication.role="Accountent";
            
            Authentication.userId = new EmployeeEntity();
            Authentication.userId.userId = Authentication.userId.generateId();
            Authentication.userId.name=myobj.name;
            Authentication.userId.gender=myobj.gender;
            Authentication.userId.dob=myobj.dob;
            Authentication.userId.nid=myobj.nid;
            Authentication.userId.phone=myobj.phone;
            Authentication.userId.address=myobj.address;
            Authentication.userId.filename=myobj.filename;
            
            const existNID = await this.employeeRepo.findOneBy({nid:Authentication.userId.nid});
            if (existNID) {
                return "This NID already exists";
            }
            const existEmail = await this.autheRepo.findOneBy({email:Authentication.email});
            if (existEmail) {
                return "This Email already exists";
            }
            await this.employeeRepo.save(Authentication.userId);
            await this.autheRepo.save(Authentication);
            return myobj;
        } catch (error) {
            // Here We Handle The Error 
            //return "An error occurred during account creation.";
            throw new Error("An error occurred during account creation.");
        }
    }
    async deleteEmployee(userId: string): Promise<string> {
        try {
            const account = await this.employeeRepo.findOne({ where: { userId: userId }, relations: ['Authentication'] });
            if (!account) {
                throw new NotFoundException('Account is not found');
            }
    
            // Here I Remove Associated Authentication Data
            if (account.Authentication) {
                await this.autheRepo.remove(account.Authentication);
            }
    
            // Finally, Remove The Account Data
            await this.employeeRepo.delete(userId);
            
            return "User Deleted";
        } catch (error) {
            // Here We Handle The Error 
            throw new Error("Failed to delete user. Please try again."); 
        }
    }
    async updateEmployee(userId: string, myobj: EmployeeDTO): Promise<EmployeeEntity | string> {
        try {
            const account = await this.employeeRepo.findOne({ where: { userId: userId }, relations: ['Authentication'] });
            if (!account) {
                throw new NotFoundException('Account is not found');
            }
    
            const Authentication = new AuthenticationEntity();
            Authentication.email = account.Authentication.email;
            Authentication.password = myobj.password;
            Authentication.role = account.Authentication.role;
            Authentication.isActive = myobj.isActive;
    
            Authentication.userId = new EmployeeEntity();
            Authentication.userId.userId = account.userId;
            Authentication.userId.name = myobj.name;
            Authentication.userId.gender = myobj.gender;
            Authentication.userId.dob = myobj.dob;
            Authentication.userId.nid = myobj.nid;
            Authentication.userId.phone = myobj.phone;
            Authentication.userId.address = myobj.address;
            Authentication.userId.filename = myobj.filename;
    
            const existNID = await this.employeeRepo.findOneBy({ nid: Authentication.userId.nid });
            if (existNID && account.nid != Authentication.userId.nid) {
                return "This NID already exists";
            }
    
            if (account.Authentication.email !== myobj.email) {
                return "Email Cannot Change";
            }
    
            await this.employeeRepo.save(Authentication.userId);
            await this.autheRepo.save(Authentication);
            const updatedInfo = await this.employeeRepo.findOne({ where: { userId: userId }, relations: ['Authentication'] });
            return updatedInfo;
        } catch (error) {
            // Here We Handle The Error 
            throw new Error("Error occurred while updating employee.");
        }
    }
    

    async getAccountInfo(): Promise<AuthenticationEntity[] | string> {
        try {
            const accounts = await this.autheRepo.find({ where: { role: 'Accountent' }, relations: ['userId'] });
            if (!accounts || accounts.length === 0) {
                throw new NotFoundException('There Is No Account Found');
            }
    
            return accounts;
        } catch (error) {
            // Here We Handle The Error 
            throw new Error("Error occurred while fetching account information.");
        }
    }

    async getAccountInfoById(userId:string): Promise<EmployeeEntity|string> {
        try{
            const account= await this.employeeRepo.findOne({where:{userId:userId},relations: ['Authentication']});
            const role =account.Authentication.role;
            if (!account||role!='Accountent') {
                throw new NotFoundException('There Is No Account Found');
            }
            if(role=='Accountent'){
                return account;
            }
        }catch (error) {
            // Here We Handle The Error 
            throw new Error("Error occurred while fetching account information.");
        }
    }
    async getProfile(userEmail: string): Promise<profileDTO | string> {
        try {
            const account = await this.autheRepo.findOne({ where: { email: userEmail }, relations: ['userId'] });
            
            if (!account) {
                throw new NotFoundException('User not found');
            }
    
            const userInfo = new profileDTO();
            const date = new Date(account.userId.dob);
            const formattedDate = date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: '2-digit',
            });
    
            userInfo.userId = account.userId.userId;
            userInfo.name = account.userId.name;
            userInfo.gender = account.userId.gender;
            userInfo.dob = formattedDate;
            userInfo.nid = account.userId.nid;
            userInfo.phone = account.userId.phone;
            userInfo.address = account.userId.address;
            userInfo.email = account.email;
            userInfo.role = account.role;
            userInfo.filename = account.userId.filename;
    
            return userInfo;
        } catch (error) {
           // Here We Handle The Error 
            throw new Error("Error occurred while getting user profile.");
        }
    }
    

    async updateProfile(userEmail: string, myobj: profileDTO): Promise<profileDTO | string> {
        try {
            const account = await this.autheRepo.findOne({ where: { email: userEmail }, relations: ['userId'] });
    
            if (!account) {
                throw new NotFoundException('User not found');
            }
    
            const Authentication = new AuthenticationEntity();
            Authentication.email = account.email;
            Authentication.password = account.password;
            Authentication.role = account.role;
            Authentication.isActive = account.isActive;
    
            Authentication.userId = new EmployeeEntity();
            Authentication.userId = account.userId;
            Authentication.userId.name = myobj.name;
            Authentication.userId.gender = myobj.gender;
            Authentication.userId.dob = new Date(Date.parse(myobj.dob));
            Authentication.userId.nid = myobj.nid;
            Authentication.userId.phone = myobj.phone;
            Authentication.userId.address = myobj.address;
            
            if (Authentication.userId.filename !== myobj.filename) {
                Authentication.userId.filename = myobj.filename;
            }
    
            const existNID = await this.employeeRepo.findOneBy({ nid: Authentication.userId.nid });
            if (existNID && account.userId.nid !== Authentication.userId.nid) {
                return "This NID already exists";
            }
    
            // if (account.userId.userId !== myobj.userId) {
            //     return "UserID Cannot be Changed";
            // }
            if (account.email !== myobj.email) {
                return "Email Cannot be Changed";
            }
            // if (account.role !== myobj.role) {
            //     return "Role Cannot be Changed";
            // }
    
            await this.employeeRepo.save(Authentication.userId);
            await this.autheRepo.save(Authentication);
    
            const updatedInfo = await this.autheRepo.findOne({ where: { email: userEmail }, relations: ['userId'] });
            const userInfo = new profileDTO();
            const date = new Date(updatedInfo.userId.dob);
    
            const formattedDate = date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: '2-digit',
            });
            userInfo.userId = updatedInfo.userId.userId;
            userInfo.name = updatedInfo.userId.name;
            userInfo.gender = updatedInfo.userId.gender;
            userInfo.dob = formattedDate;
            userInfo.nid = updatedInfo.userId.nid;
            userInfo.phone = updatedInfo.userId.phone;
            userInfo.address = updatedInfo.userId.address;
            userInfo.email = updatedInfo.email;
            userInfo.role = updatedInfo.role;
            userInfo.filename = updatedInfo.userId.filename;
    
            return userInfo;
        } catch (error) {
            // Here We Handle The Error 
            throw new Error("Error occurred while updating user profile.");
        }
    }
     
    async passwordChange(userEmail: string, myobj: changePasswordDTO): Promise<AuthenticationEntity | string> {
        try {
            const account = await this.autheRepo.findOne({ where: { email: userEmail } });
    
            if (!account) {
                throw new NotFoundException('User not found');
            }
    
            const isMatch = await bcrypt.compare(myobj.currentPassword, account.password);
            if (!isMatch) {
                throw new UnauthorizedException("Please Give Valid Password");
            }
            if (myobj.newPassword !== myobj.confirmPassword) {
                throw new BadRequestException("New password and confirm password do not match");
            }
    
            const salt = await bcrypt.genSalt();
            const hashedPassword = await bcrypt.hash(myobj.newPassword, salt);
    
            account.password = hashedPassword;
            await this.autheRepo.save(account);
    
            return "Password successfully changed.";
        } catch (error) {
            // Here We Handle The Error 
            throw new Error("Error occurred while changing password.");
        }
    }
      
    async getInactiveUserAccount(): Promise<string | any[]> {
        try {
            const accounts = await this.autheRepo.find({ where: { role: 'User', isActive: false }, relations: ['userId'] });
            
            if (!accounts || accounts.length === 0) {
                throw new NotFoundException('No inactive user accounts found');
            }
    
            const processedAccounts = [];
    
            for (const account of accounts) {
                const date = new Date(account.userId.dob);
                const formattedDate = date.toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: '2-digit',
                });
    
                processedAccounts.push({
                    UserID: account.userId.userId,
                    Name: account.userId.name,
                    Gender: account.userId.gender,
                    DOB: formattedDate,
                    NID: account.userId.nid,
                    PhoneNumber: account.userId.phone,
                    Address: account.userId.address,
                    PictureName: account.userId.filename,
                    Email: account.email,
                    Role: account.role,
                    AccountStatus: "Inactive"
                });
            }
    
            return processedAccounts;
        } catch (error) {
            // Here We Handle The Error 
            throw new Error("Error occurred while getting inactive user accounts.");
        }
    }
    
    async activateUserAccount(userId: string): Promise<string> {
        try {
            const account = await this.employeeRepo.findOne({ where: { userId: userId }, relations: ['Authentication', 'Accounts'] });
            
            if (!account) {
                throw new NotFoundException('No account found related to user ID');
            }
    
            const Authentication = new AuthenticationEntity();
            Authentication.email = account.Authentication.email;
            Authentication.password = account.Authentication.password;
            Authentication.role = account.Authentication.role;
            Authentication.isActive = true;
    
            const message = [];
    
            for (const acc of account.Accounts) {
                message.push({
                    UserID: account.userId,
                    Name: account.name,
                    Email: account.Authentication.email,
                    AccountStatus: "Active",
                    AccountNumber: acc.accountNumber,
                    AccountType: acc.accountType,
                    Balance: acc.balance,
                });
            }
    
            const emailContent = JSON.stringify(message);
            const emailInfo = account.Authentication.email;
    
            await this.autheRepo.save(Authentication);
            await this.emailService.sendMail(emailInfo, "Account Activation Information", emailContent);
    
            return "UserID: " + userId + " is now active.";
        } catch (error) {
            // Here We Handle The Error 
            throw new Error("Error occurred while activating user account.");
        }
    }
    
    async deactivateUserAccount(userId: string): Promise<string> {
        try {
            const account = await this.employeeRepo.findOne({ where: { userId: userId }, relations: ['Authentication', 'Accounts'] });
            
            if (!account) {
                throw new NotFoundException('No account found related to user ID');
            }
    
            const Authentication = new AuthenticationEntity();
            Authentication.email = account.Authentication.email;
            Authentication.password = account.Authentication.password;
            Authentication.role = account.Authentication.role;
            Authentication.isActive = false;
    
            const message = [];
    
            for (const acc of account.Accounts) {
                message.push({
                    UserID: account.userId,
                    Name: account.name,
                    Email: account.Authentication.email,
                    AccountStatus: "Inactive",
                    AccountNumber: acc.accountNumber,
                    AccountType: acc.accountType,
                    Balance: acc.balance,
                });
            }
    
            const emailContent = JSON.stringify(message);
            const emailInfo = account.Authentication.email;
    
            await this.autheRepo.save(Authentication);
            await this.emailService.sendMail(emailInfo, "Account Deactivation Information", emailContent);
    
            return "UserID: " + userId + " is now deactivated.";
        } catch (error) {
            // Here We Handle The Error 
            throw new Error("Error occurred while deactivating user account.");
        }
    }
    
    async getUserAccountInfo(): Promise<string | any[]> {
        try {
            const subString = "U-";
            const accounts = await this.employeeRepo.find({ where: { userId: Like(subString + '%') }, relations: ['Authentication', 'Accounts'] });
            
            if (!accounts || accounts.length === 0) {
                throw new NotFoundException('No user accounts found');
            }
    
            const processedAccounts = [];
    
            for (const account of accounts) {
                const userDate = new Date(account.dob);
                const formattedDateUser = userDate.toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: '2-digit',
                });
    
                for (const acc of account.Accounts) {
                    const dateNominee = new Date(acc.dob);
                    const formattedDateNominee = dateNominee.toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: '2-digit',
                    });
    
                    processedAccounts.push({
                        UserID: account.userId,
                        Name: account.name,
                        Gender: account.gender,
                        DOB: formattedDateUser,
                        NID: account.nid,
                        PhoneNumber: account.phone,
                        Address: account.address,
                        PictureName: account.filename,
                        Email: account.Authentication.email,
                        Role: account.Authentication.role,
                        AccountStatus: account.Authentication.isActive,
                        AccountNumber: acc.accountNumber,
                        AccountType: acc.accountType,
                        Balance: acc.balance,
                        NomineeName: acc.name,
                        NomineeGender: acc.gender,
                        NomineeDOB: formattedDateNominee,
                        NomineeNID: acc.nid,
                        NomineePhoneNumber: acc.phone,
                        NomineeAddress: acc.address,
                        NomineePictureName: acc.filename
                    });
                }
            }
    
            return processedAccounts;
        } catch (error) {
            // Here We Handle The Error 
            throw new Error("Error occurred while getting user account information.");
        }
    }
    
    async getTransactionHistory(): Promise<string | any[]> {
        try {
            const transactions = await this.transactionRepo.find();
            
            if (!transactions || transactions.length === 0) {
                throw new NotFoundException('No transaction history found');
            }
    
            const processedTransactions = [];
    
            for (const transaction of transactions) {
                const date = new Date(transaction.applicationTime);
                const formattedDate = date.toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                    hour12: false // Set to true if you prefer 12-hour format
                });
    
                processedTransactions.push({
                    TransactionID: transaction.transactionId,
                    AccountNumber: transaction.acountNumber,
                    Amount: transaction.amount,
                    ReceiverAccountNumber: transaction.receiverAccount,
                    AccountHolderName: transaction.holderName,
                    AccountType: transaction.accountType,
                    BankCode: transaction.bankCode,
                    RoutingNumber: transaction.routingNumber,
                    TransferType: transaction.transferType,
                    Status: transaction.transactionStatus,
                    TransactionTime: formattedDate
                });
            }
    
            return processedTransactions;
        } catch (error) {
            // Here We Handle The Error 
            throw new Error("Error occurred while getting transaction history.");
        }
    }
    
    async getTransactionHistoryByUserId(userId: string): Promise<string | any[]> {
        try {
            const account = await this.employeeRepo.findOne({ where: { userId: userId }, relations: ['Transactions'] });
    
            if (!account) {
                throw new NotFoundException('No account found related to this user');
            }
    
            const processedTransactions = [];
    
            for (const transaction of account.Transactions) {
                const date = new Date(transaction.applicationTime);
                const formattedDate = date.toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                    hour12: false // Set to true if you prefer 12-hour format
                });
    
                processedTransactions.push({
                    TransactionID: transaction.transactionId,
                    AccountNumber: transaction.acountNumber,
                    Amount: transaction.amount,
                    ReceiverAccountNumber: transaction.receiverAccount,
                    AccountHolderName: transaction.holderName,
                    AccountType: transaction.accountType,
                    BankCode: transaction.bankCode,
                    RoutingNumber: transaction.routingNumber,
                    TransferType: transaction.transferType,
                    Status: transaction.transactionStatus,
                    TransactionTime: formattedDate
                });
            }
    
            return processedTransactions;
        } catch (error) {
            // Here We Handle The Error 
            throw new Error("Error occurred while getting transaction history by user ID.");
        }
    }
    
    async getTransactionHistoryByTransactionId(transactionId: string): Promise<string | any> {
        try {
            const transaction = await this.transactionRepo.findOne({ where: { transactionId: transactionId } });
    
            if (!transaction) {
                throw new NotFoundException('No transaction found with this ID');
            }
    
            const date = new Date(transaction.applicationTime);
            const formattedDate = date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: false // Set to true if you prefer 12-hour format
            });
    
            const processedTransactions = {
                TransactionID: transaction.transactionId,
                AccountNumber: transaction.acountNumber,
                Amount: transaction.amount,
                ReceiverAccountNumber: transaction.receiverAccount,
                AccountHolderName: transaction.holderName,
                AccountType: transaction.accountType,
                BankCode: transaction.bankCode,
                RoutingNumber: transaction.routingNumber,
                TransferType: transaction.transferType,
                Status: transaction.transactionStatus,
                TransactionTime: formattedDate
            };
    
            return processedTransactions;
        } catch (error) {
            // Here We Handle The Error 
            throw new Error("Error occurred while getting transaction history by transaction ID.");
        }
    }
    
    async getIncompleteTransfer(): Promise<string | any[]> {
        try {
            const transactions = await this.transactionRepo.find({ where: { transactionStatus: false } });
    
            if (!transactions || transactions.length === 0) {
                throw new NotFoundException('No incomplete transactions found');
            }
    
            const processedTransactions = [];
    
            for (const transaction of transactions) {
                const date = new Date(transaction.applicationTime);
                const formattedDate = date.toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                    hour12: false // Set to true if you prefer 12-hour format
                });
    
                processedTransactions.push({
                    TransactionID: transaction.transactionId,
                    AccountNumber: transaction.acountNumber,
                    Amount: transaction.amount,
                    ReceiverAccountNumber: transaction.receiverAccount,
                    AccountHolderName: transaction.holderName,
                    AccountType: transaction.accountType,
                    BankCode: transaction.bankCode,
                    RoutingNumber: transaction.routingNumber,
                    TransferType: transaction.transferType,
                    Status: transaction.transactionStatus,
                    TransactionTime: formattedDate
                });
            }
    
            return processedTransactions;
        } catch (error) {
            // Here We Handle The Error 
            throw new Error("Error occurred while getting incomplete transfers.");
        }
    }
    
    async confirmTransfer(transactionId: string): Promise<string> {
        try {
            const transaction = await this.transactionRepo.findOne({ where: { transactionId: transactionId }, relations: ['userId'] });
    
            if (!transaction) {
                throw new NotFoundException('No transaction found with this ID');
            }
    
            const userId = transaction.userId.userId;
            const accountInfo = await this.employeeRepo.findOne({ where: { userId: userId }, relations: ['Authentication'] });
            
            if (!accountInfo) {
                throw new Error('Account information is missing');
            }
    
            const emailInfo = accountInfo.Authentication.email;
    
            if (!emailInfo) {
                throw new Error('Email information is missing');
            }
    
            const Transaction = new TransactionEntity();
            Transaction.acountNumber = transaction.acountNumber;
            Transaction.amount = transaction.amount;
            Transaction.receiverAccount = transaction.receiverAccount;
            Transaction.holderName = transaction.holderName;
            Transaction.bankCode = transaction.bankCode;
            Transaction.routingNumber = transaction.routingNumber;
            Transaction.applicationTime = transaction.applicationTime;
            Transaction.accountType = transaction.accountType;
            Transaction.transferType = transaction.transferType;
            Transaction.transactionStatus = true;
            Transaction.transactionId = transaction.transactionId;
    
            const date = new Date(transaction.applicationTime);
            const formattedDate = date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: false // Set to true if you prefer 12-hour format
            });
    
            const message = {
                AccountNumber: transaction.acountNumber,
                Amount: transaction.amount,
                ReceiverAccountNumber: transaction.receiverAccount,
                ReceiverAccountHolderName: transaction.holderName,
                TransactionTime: formattedDate
            };
    
            const emailContent = JSON.stringify(message);
    
            await this.transactionRepo.save(Transaction);
            await this.emailService.sendMail(emailInfo, "Transaction Completed", emailContent);
    
            return "TransactionID: " + transactionId + " is now confirmed.";
        } catch (error) {
            // Here We Handle The Error 
            throw new Error("Error occurred while confirming transfer.");
        }
    }
    
    async getAllServiceRequests(): Promise<string | any[]> {
        try {
            const services = await this.serviceRepo.find({ relations: ['account'] });
    
            if (!services || services.length === 0) {
                throw new NotFoundException('No service requests found');
            }
    
            const processedServices = [];
    
            for (const service of services) {
                const date = new Date(service.applicationTime);
                const formattedDate = date.toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                    hour12: false // Set to true if you prefer 12-hour format
                });
    
                processedServices.push({
                    ServiceID: service.serviceId,
                    AccountNumber: service.account.accountNumber,
                    ServiceType: service.name,
                    ServiceDocument: service.filename,
                    ServiceStatus: service.status,
                    ApplicationTime: formattedDate
                });
            }
    
            return processedServices;
        } catch (error) {
            // Here We Handle The Error 
            throw new Error("Error occurred while getting all service requests.");
        }
    }
    
    async getServiceRequestById(serviceId: number): Promise<string | any> {
        try {
            const service = await this.serviceRepo.findOne({ where: { serviceId: serviceId }, relations: ['account'] });
    
            if (!service) {
                throw new NotFoundException('No service request found with this ID');
            }
    
            const date = new Date(service.applicationTime);
            const formattedDate = date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: false // Set to true if you prefer 12-hour format
            });
    
            const processedService = {
                AccountNumber: service.account.accountNumber,
                ServiceType: service.name,
                ServiceDocument: service.filename,
                ServiceStatus: service.status,
                ApplicationTime: formattedDate
            };
    
            return processedService;
        } catch (error) {
            // Here We Handle The Error 
            throw new Error("Error occurred while getting service request by ID.");
        }
    }
    
    async processServiceRequestById(serviceId: number): Promise<string> {
        try {
            const service = await this.serviceRepo.findOne({ where: { serviceId: serviceId }, relations: ['account'] });
    
            if (!service) {
                throw new NotFoundException('No service request found with this ID');
            }
    
            if (service.name === "Drebit Card") {
                const date = new Date(service.applicationTime);
                const formattedDate = date.toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                    hour12: false // Set to true if you prefer 12-hour format
                });
                const accountNumber = service.account.accountNumber;
                const account = await this.accountRepo.findOne({ where: { accountNumber: accountNumber }, relations: ['userId'] });
                const userId = account.userId.userId;
                const accountInfo = await this.employeeRepo.findOne({ where: { userId: userId }, relations: ['Authentication'] });
                const emailInfo = accountInfo.Authentication.email;
    
                if (!emailInfo) {
                    throw new Error('Email information is missing');
                }
    
                const Service = new ServiceEntity();
                Service.serviceId = service.serviceId;
                Service.name = service.name;
                Service.filename = service.filename;
                Service.status = true;
    
                const message = {
                    AccountNumber: service.account.accountNumber,
                    ServiceType: service.name,
                    ServiceStatus: "Processed",
                    ApplicationTime: formattedDate
                };
    
                // Convert the message array to a string or an object here
                const emailContent = JSON.stringify(message);
    
                await this.serviceRepo.save(Service);
                await this.emailService.sendMail(emailInfo, "Service Request Confirmed", emailContent);
    
                return "ServiceID: " + serviceId + " is now processed.";
            }
    
            throw new NotFoundException('You do not have permission to confirm this data.');
        } catch (error) {
            // Here We Handle The Error 
            throw new Error("Error occurred while processing service request by ID.");
        }
    }
    
    async sendVerificationReportToManager(serviceId: number): Promise<string> {
        try {
            const service = await this.serviceRepo.findOne({ where: { serviceId: serviceId, status: false }, relations: ['account'] });
    
            if (!service) {
                throw new NotFoundException('This service request is already processed.');
            }
    
            const date = new Date(service.applicationTime);
            const formattedDate = date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: false // Set to true if you prefer 12-hour format
            });
    
            // Replace the emailInfo with your logic to fetch manager's email dynamically
            const emailInfo = "niloy9195@gmail.com"; // Example email, replace with your logic to fetch manager's email
            
            if (!emailInfo) {
                throw new Error('Email information is missing.');
            }
    
            const message = {
                AccountNumber: service.account.accountNumber,
                ServiceType: service.name,
                Document: service.filename,
                ServiceStatus: "Waiting",
                ApplicationTime: formattedDate
            };
    
            // Convert the message array to a string or an object here
            const emailContent = JSON.stringify(message);
    
            await this.emailService.sendMail(emailInfo, "Verification Report of Service Request", emailContent);
    
            return "ServiceID: " + serviceId + " report sent to manager.";
        } catch (error) {
            // Here We Handle The Error 
            throw new Error("Error occurred while sending verification report to manager.");
        }
    }
    
    async findOne(logindata: loginDTO): Promise<any> {
        try {
            return await this.autheRepo.findOneBy({ email: logindata.email });
        } catch (error) {
            // Here We Handle The Error 
            throw new Error("Error occurred while finding user.");
        }
    }
    

}