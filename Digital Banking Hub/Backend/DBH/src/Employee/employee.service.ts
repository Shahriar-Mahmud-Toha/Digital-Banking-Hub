import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { EmployeeDTO, changePasswordDTO, profileDTO } from "./employee.dto";
import { loginDTO } from "../DTO/login.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Like, Repository } from "typeorm";
import { Authentication } from "../Authentication/auth.entity";
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { AccountEntity } from "./Entity/Account.entity";
import { EmailService } from "./Mailer/mailer.service";
import { TransactionEntity } from "./Entity/transaction.entity";
import { ServiceEntity } from "./Entity/service.entity";
import { Users } from "src/CommonEntities/Users.entity";
import { AdminService } from "src/Administrator/admin.service";
import { parse } from 'date-fns';

@Injectable()
export class EmployeeService {
    [x: string]: any;
    constructor(@InjectRepository(Users) private usersRepo: Repository<Users>,
        @InjectRepository(Authentication) private autheRepo: Repository<Authentication>,
        @InjectRepository(AccountEntity) private accountRepo: Repository<AccountEntity>,
        @InjectRepository(TransactionEntity) private transactionRepo: Repository<TransactionEntity>,
        @InjectRepository(ServiceEntity) private serviceRepo: Repository<ServiceEntity>,
        private readonly adminService: AdminService,
        private jwtService: JwtService,
        private emailService: EmailService

    ) { }
    getUsers(): object {
        return { message: "hellow Admin" }
    }

    async createAccount(myobj: EmployeeDTO): Promise<EmployeeDTO | string> {
        try {
            const User = new Users();
            User.userId = User.generateId();
            User.FullName = myobj.name;
            User.Gender = myobj.gender;
            // User.DOB = myobj.dob;
            User.DOB = parse(myobj.dob.toString(), 'dd-MM-yyyy', new Date());
            User.NID = myobj.nid;
            User.Phone = myobj.phone;
            User.Address = myobj.address;
            User.FileName = myobj.filename;
            User.Email = myobj.email;

            // User.email = new Authentication();
            // User.email = myobj.email;
            // User.email.password = myobj.password;
            // User.email.role = "Accountent";
            
            const authentication = new Authentication();
            authentication.Email = myobj.email;
            authentication.Password = myobj.password;
            authentication.RoleID = await this.adminService.getRoleIdByName("accountant");

            const existNID = await this.usersRepo.findOneBy({ NID: User.NID });
            if (existNID) {
                return "This NID already exists";
            }
            const existEmail = await this.autheRepo.findOneBy({ Email: authentication.Email });
            if (existEmail) {
                return "This Email already exists";
            }
            await this.autheRepo.save(authentication);
            await this.usersRepo.save(User);
            return myobj;
        } catch (error) {
            // Here We Handle The Error 
            //return "An error occurred during account creation.";
            throw new Error("An error occurred during account creation.: "+error);
        }
    }
    async deleteEmployee(userId: string): Promise<void> {
        const account = await this.usersRepo.findOne({ where: { userId }, relations: ['Authentication'] });
        if (!account) {
            throw new NotFoundException('Account is not found');
        }

        try {
            if (account.Email) {
                const authAcc = await this.autheRepo.find({
                    where: { Email: account.Email, RoleID: await this.adminService.getRoleIdByName("accountant") }
                });
                await this.autheRepo.remove(authAcc);
            }
            // await this.usersRepo.delete(userId);
            console.log('delete')
        } catch (error) {
            // Log the error for debugging purposes
            console.error('Error occurred while deleting user:', error);

            // Propagate the error to the caller
            throw error;
        }
    }

    async updateEmployee(userId: string, myobj: EmployeeDTO): Promise<Users | string> {
        try {
            const account = await this.usersRepo.findOne({ where: { userId: userId }, relations: ['Authentication'] });
            if (!account) {
                throw new NotFoundException('Account is not found');
            }

            const User = new Users();
            User.userId = account.userId;
            User.FullName = myobj.name;
            User.Gender = myobj.gender;
            User.DOB = myobj.dob;
            User.NID = myobj.nid;
            User.Phone = myobj.phone;
            User.Address = myobj.address;
            User.FileName = myobj.filename;
            User.Email = myobj.email;

            // User.email = new Authentication();
            // User.email.email = account.email.email;
            // User.email.password = myobj.password;
            // User.email.role = account.email.role;
            // User.email.isActive = myobj.isActive;

            const authentication = new Authentication();
            authentication.Email = myobj.email;
            authentication.Password = myobj.password;
            authentication.Active = myobj.isActive;
            authentication.RoleID = await this.adminService.getRoleIdByName("accountant");

            const existNID = await this.usersRepo.findOneBy({ NID: User.NID });
            if (existNID && account.NID != User.NID) {
                return "This NID already exists";
            }

            if (account.Email !== myobj.email) {
                return "Email Cannot Change";
            }

            await this.autheRepo.save(authentication);
            await this.usersRepo.save(User);
            const updatedInfo = await this.usersRepo.findOne({ where: { userId: userId }, relations: ['Authentication'] });
            return updatedInfo;
        } catch (error) {
            // Here We Handle The Error 
            throw new Error("Error occurred while updating employee.");
        }
    }


    async getAccountInfo(): Promise<Authentication[] | string> {
        try {
            const accounts = await this.autheRepo.find({ where: { RoleID: await this.adminService.getRoleIdByName("accountant") }, relations: ['User'] });
            if (!accounts || accounts.length === 0) {
                throw new NotFoundException('There Is No Account Found');
            }

            return accounts;
        } catch (error) {
            // Here We Handle The Error 
            throw new Error("Error occurred while fetching account information.");
        }
    }

    async getAccountInfoById(userId: string): Promise<Users | string> {
        try {
            const account = await this.usersRepo.findOne({ where: { userId: userId }, relations: ['Authentication'] });
            const roleId = account.Authentication.RoleID;
            const dbRoleId = await this.adminService.getRoleIdByName("accountant");
            if (!account || roleId != dbRoleId) {
                throw new NotFoundException('There Is No Account Found');
            }
            if (roleId == dbRoleId) {
                return account;
            }
        } catch (error) {
            // Here We Handle The Error 
            throw new Error("Error occurred while fetching account information.");
        }
    }
    async getProfile(userEmail: string): Promise<profileDTO | string> {
        try {
            const account = await this.autheRepo.findOne({ where: { Email: userEmail }, relations: ['User'] });

            if (!account) {
                throw new NotFoundException('User not found');
            }

            const userInfo = new profileDTO();
            const date = new Date(account.User.DOB);
            const formattedDate = date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: '2-digit',
            });

            userInfo.userId = account.User.userId;
            userInfo.name = account.User.FullName;
            userInfo.gender = account.User.Gender;
            userInfo.dob = formattedDate;
            userInfo.nid = account.User.NID;
            userInfo.phone = account.User.Phone;
            userInfo.address = account.User.Address;
            userInfo.email = account.Email;
            userInfo.role = account.RoleID;
            userInfo.filename = account.User.FileName;

            return userInfo;
        } catch (error) {
            // Here We Handle The Error 
            throw new Error("Error occurred while getting user profile.");
        }
    }


    async updateProfile(userEmail: string, myobj: profileDTO): Promise<profileDTO | string> {
        try {
            const account = await this.autheRepo.findOne({ where: { Email: userEmail }, relations: ['User'] });

            if (!account) {
                throw new NotFoundException('User not found');
            }

            const User = new Users();
            User.userId = account.User.userId;
            User.FullName = myobj.name;
            User.Gender = myobj.gender;
            User.DOB = new Date(Date.parse(myobj.dob));
            User.NID = myobj.nid;
            User.Phone = myobj.phone;
            User.Address = myobj.address;

            // User.email = new Authentication();
            // User.email.email = account.email;
            // User.email.password = account.password;
            // User.email.role = account.role;
            // User.email.isActive = account.isActive;
            
            User.Authentication = new Authentication();
            User.Authentication.Email = account.Email;
            User.Authentication.Password = account.Password;
            User.Authentication.RoleID = account.RoleID;
            User.Authentication.Active = account.Active;

            if (User.FileName !== myobj.filename) {
                User.FileName = myobj.filename;
            }

            const existNID = await this.usersRepo.findOneBy({ NID: User.NID });
            if (existNID && account.User.NID !== User.NID) {
                return "This NID already exists";
            }

            // if (account.userId.userId !== myobj.userId) {
            //     return "UserID Cannot be Changed";
            // }
            if (account.Email !== myobj.email) {
                return "Email Cannot be Changed";
            }
            // if (account.role !== myobj.role) {
            //     return "Role Cannot be Changed";
            // }

            await this.usersRepo.save(User);
            await this.autheRepo.save(User.Authentication);

            const updatedInfo = await this.autheRepo.findOne({ where: { Email: userEmail }, relations: ['User'] });
            const userInfo = new profileDTO();
            const date = new Date(updatedInfo.User.DOB);

            const formattedDate = date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: '2-digit',
            });
            userInfo.userId = updatedInfo.User.userId;
            userInfo.name = updatedInfo.User.FullName;
            userInfo.gender = updatedInfo.User.Gender;
            userInfo.dob = formattedDate;
            userInfo.nid = updatedInfo.User.NID;
            userInfo.phone = updatedInfo.User.Phone;
            userInfo.address = updatedInfo.User.Address;
            userInfo.email = updatedInfo.Email;
            userInfo.role = updatedInfo.RoleID;
            userInfo.filename = updatedInfo.User.FileName;

            return userInfo;
        } catch (error) {
            // Here We Handle The Error 
            throw new Error("Error occurred while updating user profile.");
        }
    }

    async passwordChange(userEmail: string, myobj: changePasswordDTO): Promise<Authentication | string> {
        try {
            const account = await this.autheRepo.findOne({ where: { Email: userEmail } });

            if (!account) {
                throw new NotFoundException('User not found');
            }

            const isMatch = await bcrypt.compare(myobj.currentPassword, account.Password);
            if (!isMatch) {
                throw new UnauthorizedException("Please Give Valid Password");
            }
            if (myobj.newPassword !== myobj.confirmPassword) {
                throw new BadRequestException("New password and confirm password do not match");
            }

            const salt = await bcrypt.genSalt();
            const hashedPassword = await bcrypt.hash(myobj.newPassword, salt);

            account.Password = hashedPassword;
            await this.autheRepo.save(account);

            return "Password successfully changed.";
        } catch (error) {
            // Here We Handle The Error 
            throw new Error("Error occurred while changing password.");
        }
    }

    async getInactiveUserAccount(): Promise<string | any[]> {
        try {
            const accounts = await this.autheRepo.find({ where: { RoleID: 'accountant', Active: false }, relations: ['User'] });

            if (!accounts || accounts.length === 0) {
                throw new NotFoundException('No inactive user accounts found');
            }

            const processedAccounts = [];

            for (const account of accounts) {
                const date = new Date(account.User.DOB);
                const formattedDate = date.toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: '2-digit',
                });

                processedAccounts.push({
                    UserID: account.User.userId,
                    Name: account.User.FullName,
                    Gender: account.User.Gender,
                    DOB: formattedDate,
                    NID: account.User.NID,
                    PhoneNumber: account.User.Phone,
                    Address: account.User.Address,
                    PictureName: account.User.FileName,
                    Email: account.Email,
                    Role: account.RoleID,
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
            const account = await this.usersRepo.findOne({ where: { userId: userId }, relations: ['Authentication', 'Accounts'] });

            if (!account) {
                throw new NotFoundException('No account found related to user ID');
            }

            const authentication = new Authentication();
            authentication.Email = account.Authentication.Email;
            authentication.Password = account.Authentication.Password;
            authentication.RoleID = account.Authentication.RoleID;
            authentication.Active = true;

            const message = [];

            for (const acc of account.Accounts) {
                message.push({
                    UserID: account.userId,
                    Name: account.FullName,
                    Email: account.Authentication.Email,
                    AccountStatus: "Active",
                    AccountNumber: acc.accountNumber,
                    AccountType: acc.accountType,
                    Balance: acc.balance,
                });
            }

            const emailContent = JSON.stringify(message);
            const emailInfo = account.Authentication.Email;

            await this.autheRepo.save(authentication);
            await this.emailService.sendMail(emailInfo, "Account Activation Information", emailContent);

            return "UserID: " + userId + " is now active.";
        } catch (error) {
            // Here We Handle The Error 
            throw new Error("Error occurred while activating user account.");
        }
    }

    async deactivateUserAccount(userId: string): Promise<string> {
        try {
            const account = await this.usersRepo.findOne({ where: { userId: userId }, relations: ['Authentication', 'Accounts'] });

            if (!account) {
                throw new NotFoundException('No account found related to user ID');
            }

            const authentication = new Authentication();
            authentication.Email = account.Authentication.Email;
            authentication.Password = account.Authentication.Password;
            authentication.RoleID = account.Authentication.RoleID;
            authentication.Active = false;

            const message = [];

            for (const acc of account.Accounts) {
                message.push({
                    UserID: account.userId,
                    Name: account.FullName,
                    Email: account.Authentication.Email,
                    AccountStatus: "Inactive",
                    AccountNumber: acc.accountNumber,
                    AccountType: acc.accountType,
                    Balance: acc.balance,
                });
            }

            const emailContent = JSON.stringify(message);
            const emailInfo = account.Authentication.Email;

            await this.autheRepo.save(authentication);
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
            const accounts = await this.usersRepo.find({ where: { userId: Like(subString + '%') }, relations: ['Authentication', 'Accounts'] });

            if (!accounts || accounts.length === 0) {
                throw new NotFoundException('No user accounts found');
            }

            const processedAccounts = [];

            for (const account of accounts) {
                const userDate = new Date(account.DOB);
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
                        Name: account.FullName,
                        Gender: account.Gender,
                        DOB: formattedDateUser,
                        NID: account.NID,
                        PhoneNumber: account.Phone,
                        Address: account.Address,
                        PictureName: account.FileName,
                        Email: account.Authentication.Email,
                        Role: account.Authentication.RoleID,
                        AccountStatus: account.Authentication.Active,
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
            const account = await this.usersRepo.findOne({ where: { userId: userId }, relations: ['Transactions'] });

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
            const accountInfo = await this.usersRepo.findOne({ where: { userId: userId }, relations: ['Authentication'] });

            if (!accountInfo) {
                throw new Error('Account information is missing');
            }

            const emailInfo = accountInfo.Authentication.Email;

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
                const accountInfo = await this.usersRepo.findOne({ where: { userId: userId }, relations: ['Authentication'] });
                const emailInfo = accountInfo.Authentication.Email;

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
            return await this.autheRepo.findOneBy({ Email: logindata.email });
        } catch (error) {
            // Here We Handle The Error 
            throw new Error("Error occurred while finding user.");
        }
    }


}