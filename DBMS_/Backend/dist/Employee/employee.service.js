"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmployeeService = void 0;
const common_1 = require("@nestjs/common");
const employee_dto_1 = require("./employee.dto");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const auth_entity_1 = require("../Authentication/auth.entity");
const employee_entity_1 = require("./Entity/employee.entity");
const jwt_1 = require("@nestjs/jwt");
const bcrypt = require("bcrypt");
const Account_entity_1 = require("./Entity/Account.entity");
const mailer_service_1 = require("./Mailer/mailer.service");
const transaction_entity_1 = require("./Entity/transaction.entity");
const service_entity_1 = require("./Entity/service.entity");
let EmployeeService = class EmployeeService {
    constructor(employeeRepo, autheRepo, accountRepo, transactionRepo, serviceRepo, jwtService, emailService) {
        this.employeeRepo = employeeRepo;
        this.autheRepo = autheRepo;
        this.accountRepo = accountRepo;
        this.transactionRepo = transactionRepo;
        this.serviceRepo = serviceRepo;
        this.jwtService = jwtService;
        this.emailService = emailService;
    }
    getUsers() {
        return { message: "hellow Admin" };
    }
    async createAccount(myobj) {
        try {
            const User = new employee_entity_1.EmployeeEntity();
            User.userId = User.generateId();
            User.name = myobj.name;
            User.gender = myobj.gender;
            User.dob = myobj.dob;
            User.nid = myobj.nid;
            User.phone = myobj.phone;
            User.address = myobj.address;
            User.filename = myobj.filename;
            User.email = new auth_entity_1.AuthenticationEntity();
            User.email.email = myobj.email;
            User.email.password = myobj.password;
            User.email.role = "Accountent";
            const existNID = await this.employeeRepo.findOneBy({ nid: User.nid });
            if (existNID) {
                return "This NID already exists";
            }
            const existEmail = await this.autheRepo.findOneBy({ email: User.email.email });
            if (existEmail) {
                return "This Email already exists";
            }
            await this.employeeRepo.save(User);
            await this.autheRepo.save(User.email);
            return myobj;
        }
        catch (error) {
            throw new Error("An error occurred during account creation.");
        }
    }
    async deleteEmployee(userId) {
        const account = await this.employeeRepo.findOne({ where: { userId }, relations: ['email'] });
        if (!account) {
            throw new common_1.NotFoundException('Account is not found');
        }
        try {
            if (account.email) {
                await this.autheRepo.remove(account.email);
            }
            await this.employeeRepo.delete(userId);
            console.log('delete');
        }
        catch (error) {
            console.error('Error occurred while deleting user:', error);
            throw error;
        }
    }
    async updateEmployee(userId, myobj) {
        try {
            const account = await this.employeeRepo.findOne({ where: { userId: userId }, relations: ['email'] });
            if (!account) {
                throw new common_1.NotFoundException('Account is not found');
            }
            const User = new employee_entity_1.EmployeeEntity();
            User.userId = account.userId;
            User.name = myobj.name;
            User.gender = myobj.gender;
            User.dob = myobj.dob;
            User.nid = myobj.nid;
            User.phone = myobj.phone;
            User.address = myobj.address;
            User.filename = myobj.filename;
            User.email = new auth_entity_1.AuthenticationEntity();
            User.email.email = account.email.email;
            User.email.password = myobj.password;
            User.email.role = account.email.role;
            User.email.isActive = myobj.isActive;
            const existNID = await this.employeeRepo.findOneBy({ nid: User.nid });
            if (existNID && account.nid != User.nid) {
                return "This NID already exists";
            }
            if (account.email.email !== myobj.email) {
                return "Email Cannot Change";
            }
            await this.employeeRepo.save(User);
            await this.autheRepo.save(User.email);
            const updatedInfo = await this.employeeRepo.findOne({ where: { userId: userId }, relations: ['email'] });
            return updatedInfo;
        }
        catch (error) {
            throw new Error("Error occurred while updating employee.");
        }
    }
    async getAccountInfo() {
        try {
            const accounts = await this.autheRepo.find({ where: { role: 'Accountent' }, relations: ['users'] });
            if (!accounts || accounts.length === 0) {
                throw new common_1.NotFoundException('There Is No Account Found');
            }
            return accounts;
        }
        catch (error) {
            throw new Error("Error occurred while fetching account information.");
        }
    }
    async getAccountInfoById(userId) {
        try {
            const account = await this.employeeRepo.findOne({ where: { userId: userId }, relations: ['email'] });
            const role = account.email.role;
            if (!account || role != 'Accountent') {
                throw new common_1.NotFoundException('There Is No Account Found');
            }
            if (role == 'Accountent') {
                return account;
            }
        }
        catch (error) {
            throw new Error("Error occurred while fetching account information.");
        }
    }
    async getProfile(userEmail) {
        try {
            const account = await this.autheRepo.findOne({ where: { email: userEmail }, relations: ['users'] });
            if (!account) {
                throw new common_1.NotFoundException('User not found');
            }
            const userInfo = new employee_dto_1.profileDTO();
            const date = new Date(account.users.dob);
            const formattedDate = date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: '2-digit',
            });
            userInfo.userId = account.users.userId;
            userInfo.name = account.users.name;
            userInfo.gender = account.users.gender;
            userInfo.dob = formattedDate;
            userInfo.nid = account.users.nid;
            userInfo.phone = account.users.phone;
            userInfo.address = account.users.address;
            userInfo.email = account.email;
            userInfo.role = account.role;
            userInfo.filename = account.users.filename;
            return userInfo;
        }
        catch (error) {
            throw new Error("Error occurred while getting user profile.");
        }
    }
    async updateProfile(userEmail, myobj) {
        try {
            const account = await this.autheRepo.findOne({ where: { email: userEmail }, relations: ['users'] });
            if (!account) {
                throw new common_1.NotFoundException('User not found');
            }
            const User = new employee_entity_1.EmployeeEntity();
            User.userId = account.users.userId;
            User.name = myobj.name;
            User.gender = myobj.gender;
            User.dob = new Date(Date.parse(myobj.dob));
            User.nid = myobj.nid;
            User.phone = myobj.phone;
            User.address = myobj.address;
            User.email = new auth_entity_1.AuthenticationEntity();
            User.email.email = account.email;
            User.email.password = account.password;
            User.email.role = account.role;
            User.email.isActive = account.isActive;
            if (User.filename !== myobj.filename) {
                User.filename = myobj.filename;
            }
            const existNID = await this.employeeRepo.findOneBy({ nid: User.nid });
            if (existNID && account.users.nid !== User.nid) {
                return "This NID already exists";
            }
            if (account.email !== myobj.email) {
                return "Email Cannot be Changed";
            }
            await this.employeeRepo.save(User);
            await this.autheRepo.save(User.email);
            const updatedInfo = await this.autheRepo.findOne({ where: { email: userEmail }, relations: ['users'] });
            const userInfo = new employee_dto_1.profileDTO();
            const date = new Date(updatedInfo.users.dob);
            const formattedDate = date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: '2-digit',
            });
            userInfo.userId = updatedInfo.users.userId;
            userInfo.name = updatedInfo.users.name;
            userInfo.gender = updatedInfo.users.gender;
            userInfo.dob = formattedDate;
            userInfo.nid = updatedInfo.users.nid;
            userInfo.phone = updatedInfo.users.phone;
            userInfo.address = updatedInfo.users.address;
            userInfo.email = updatedInfo.email;
            userInfo.role = updatedInfo.role;
            userInfo.filename = updatedInfo.users.filename;
            return userInfo;
        }
        catch (error) {
            throw new Error("Error occurred while updating user profile.");
        }
    }
    async passwordChange(userEmail, myobj) {
        try {
            const account = await this.autheRepo.findOne({ where: { email: userEmail } });
            if (!account) {
                throw new common_1.NotFoundException('User not found');
            }
            const isMatch = await bcrypt.compare(myobj.currentPassword, account.password);
            if (!isMatch) {
                throw new common_1.UnauthorizedException("Please Give Valid Password");
            }
            if (myobj.newPassword !== myobj.confirmPassword) {
                throw new common_1.BadRequestException("New password and confirm password do not match");
            }
            const salt = await bcrypt.genSalt();
            const hashedPassword = await bcrypt.hash(myobj.newPassword, salt);
            account.password = hashedPassword;
            await this.autheRepo.save(account);
            return "Password successfully changed.";
        }
        catch (error) {
            throw new Error("Error occurred while changing password.");
        }
    }
    async getInactiveUserAccount() {
        try {
            const accounts = await this.autheRepo.find({ where: { role: 'User', isActive: false }, relations: ['users'] });
            if (!accounts || accounts.length === 0) {
                throw new common_1.NotFoundException('No inactive user accounts found');
            }
            const processedAccounts = [];
            for (const account of accounts) {
                const date = new Date(account.users.dob);
                const formattedDate = date.toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: '2-digit',
                });
                processedAccounts.push({
                    UserID: account.users.userId,
                    Name: account.users.name,
                    Gender: account.users.gender,
                    DOB: formattedDate,
                    NID: account.users.nid,
                    PhoneNumber: account.users.phone,
                    Address: account.users.address,
                    PictureName: account.users.filename,
                    Email: account.email,
                    Role: account.role,
                    AccountStatus: "Inactive"
                });
            }
            return processedAccounts;
        }
        catch (error) {
            throw new Error("Error occurred while getting inactive user accounts.");
        }
    }
    async activateUserAccount(userId) {
        try {
            const account = await this.employeeRepo.findOne({ where: { userId: userId }, relations: ['email', 'Accounts'] });
            if (!account) {
                throw new common_1.NotFoundException('No account found related to user ID');
            }
            const Authentication = new auth_entity_1.AuthenticationEntity();
            Authentication.email = account.email.email;
            Authentication.password = account.email.password;
            Authentication.role = account.email.role;
            Authentication.isActive = true;
            const message = [];
            for (const acc of account.Accounts) {
                message.push({
                    UserID: account.userId,
                    Name: account.name,
                    Email: account.email.email,
                    AccountStatus: "Active",
                    AccountNumber: acc.accountNumber,
                    AccountType: acc.accountType,
                    Balance: acc.balance,
                });
            }
            const emailContent = JSON.stringify(message);
            const emailInfo = account.email.email;
            await this.autheRepo.save(Authentication);
            await this.emailService.sendMail(emailInfo, "Account Activation Information", emailContent);
            return "UserID: " + userId + " is now active.";
        }
        catch (error) {
            throw new Error("Error occurred while activating user account.");
        }
    }
    async deactivateUserAccount(userId) {
        try {
            const account = await this.employeeRepo.findOne({ where: { userId: userId }, relations: ['email', 'Accounts'] });
            if (!account) {
                throw new common_1.NotFoundException('No account found related to user ID');
            }
            const Authentication = new auth_entity_1.AuthenticationEntity();
            Authentication.email = account.email.email;
            Authentication.password = account.email.password;
            Authentication.role = account.email.role;
            Authentication.isActive = false;
            const message = [];
            for (const acc of account.Accounts) {
                message.push({
                    UserID: account.userId,
                    Name: account.name,
                    Email: account.email.email,
                    AccountStatus: "Inactive",
                    AccountNumber: acc.accountNumber,
                    AccountType: acc.accountType,
                    Balance: acc.balance,
                });
            }
            const emailContent = JSON.stringify(message);
            const emailInfo = account.email.email;
            await this.autheRepo.save(Authentication);
            await this.emailService.sendMail(emailInfo, "Account Deactivation Information", emailContent);
            return "UserID: " + userId + " is now deactivated.";
        }
        catch (error) {
            throw new Error("Error occurred while deactivating user account.");
        }
    }
    async getUserAccountInfo() {
        try {
            const subString = "U-";
            const accounts = await this.employeeRepo.find({ where: { userId: (0, typeorm_2.Like)(subString + '%') }, relations: ['email', 'Accounts'] });
            if (!accounts || accounts.length === 0) {
                throw new common_1.NotFoundException('No user accounts found');
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
                        Email: account.email.email,
                        Role: account.email.role,
                        AccountStatus: account.email.isActive,
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
        }
        catch (error) {
            throw new Error("Error occurred while getting user account information.");
        }
    }
    async getTransactionHistory() {
        try {
            const transactions = await this.transactionRepo.find();
            if (!transactions || transactions.length === 0) {
                throw new common_1.NotFoundException('No transaction history found');
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
                    hour12: false
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
        }
        catch (error) {
            throw new Error("Error occurred while getting transaction history.");
        }
    }
    async getTransactionHistoryByUserId(userId) {
        try {
            const account = await this.employeeRepo.findOne({ where: { userId: userId }, relations: ['Transactions'] });
            if (!account) {
                throw new common_1.NotFoundException('No account found related to this user');
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
                    hour12: false
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
        }
        catch (error) {
            throw new Error("Error occurred while getting transaction history by user ID.");
        }
    }
    async getTransactionHistoryByTransactionId(transactionId) {
        try {
            const transaction = await this.transactionRepo.findOne({ where: { transactionId: transactionId } });
            if (!transaction) {
                throw new common_1.NotFoundException('No transaction found with this ID');
            }
            const date = new Date(transaction.applicationTime);
            const formattedDate = date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: false
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
        }
        catch (error) {
            throw new Error("Error occurred while getting transaction history by transaction ID.");
        }
    }
    async getIncompleteTransfer() {
        try {
            const transactions = await this.transactionRepo.find({ where: { transactionStatus: false } });
            if (!transactions || transactions.length === 0) {
                throw new common_1.NotFoundException('No incomplete transactions found');
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
                    hour12: false
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
        }
        catch (error) {
            throw new Error("Error occurred while getting incomplete transfers.");
        }
    }
    async confirmTransfer(transactionId) {
        try {
            const transaction = await this.transactionRepo.findOne({ where: { transactionId: transactionId }, relations: ['userId'] });
            if (!transaction) {
                throw new common_1.NotFoundException('No transaction found with this ID');
            }
            const userId = transaction.userId.userId;
            const accountInfo = await this.employeeRepo.findOne({ where: { userId: userId }, relations: ['email'] });
            if (!accountInfo) {
                throw new Error('Account information is missing');
            }
            const emailInfo = accountInfo.email.email;
            if (!emailInfo) {
                throw new Error('Email information is missing');
            }
            const Transaction = new transaction_entity_1.TransactionEntity();
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
                hour12: false
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
        }
        catch (error) {
            throw new Error("Error occurred while confirming transfer.");
        }
    }
    async getAllServiceRequests() {
        try {
            const services = await this.serviceRepo.find({ relations: ['account'] });
            if (!services || services.length === 0) {
                throw new common_1.NotFoundException('No service requests found');
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
                    hour12: false
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
        }
        catch (error) {
            throw new Error("Error occurred while getting all service requests.");
        }
    }
    async getServiceRequestById(serviceId) {
        try {
            const service = await this.serviceRepo.findOne({ where: { serviceId: serviceId }, relations: ['account'] });
            if (!service) {
                throw new common_1.NotFoundException('No service request found with this ID');
            }
            const date = new Date(service.applicationTime);
            const formattedDate = date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: false
            });
            const processedService = {
                AccountNumber: service.account.accountNumber,
                ServiceType: service.name,
                ServiceDocument: service.filename,
                ServiceStatus: service.status,
                ApplicationTime: formattedDate
            };
            return processedService;
        }
        catch (error) {
            throw new Error("Error occurred while getting service request by ID.");
        }
    }
    async processServiceRequestById(serviceId) {
        try {
            const service = await this.serviceRepo.findOne({ where: { serviceId: serviceId }, relations: ['account'] });
            if (!service) {
                throw new common_1.NotFoundException('No service request found with this ID');
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
                    hour12: false
                });
                const accountNumber = service.account.accountNumber;
                const account = await this.accountRepo.findOne({ where: { accountNumber: accountNumber }, relations: ['userId'] });
                const userId = account.userId.userId;
                const accountInfo = await this.employeeRepo.findOne({ where: { userId: userId }, relations: ['email'] });
                const emailInfo = accountInfo.email.email;
                if (!emailInfo) {
                    throw new Error('Email information is missing');
                }
                const Service = new service_entity_1.ServiceEntity();
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
                const emailContent = JSON.stringify(message);
                await this.serviceRepo.save(Service);
                await this.emailService.sendMail(emailInfo, "Service Request Confirmed", emailContent);
                return "ServiceID: " + serviceId + " is now processed.";
            }
            throw new common_1.NotFoundException('You do not have permission to confirm this data.');
        }
        catch (error) {
            throw new Error("Error occurred while processing service request by ID.");
        }
    }
    async sendVerificationReportToManager(serviceId) {
        try {
            const service = await this.serviceRepo.findOne({ where: { serviceId: serviceId, status: false }, relations: ['account'] });
            if (!service) {
                throw new common_1.NotFoundException('This service request is already processed.');
            }
            const date = new Date(service.applicationTime);
            const formattedDate = date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: false
            });
            const emailInfo = "niloy9195@gmail.com";
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
            const emailContent = JSON.stringify(message);
            await this.emailService.sendMail(emailInfo, "Verification Report of Service Request", emailContent);
            return "ServiceID: " + serviceId + " report sent to manager.";
        }
        catch (error) {
            throw new Error("Error occurred while sending verification report to manager.");
        }
    }
    async findOne(logindata) {
        try {
            return await this.autheRepo.findOne({ where: { email: logindata.email }, relations: ['users'] });
        }
        catch (error) {
            throw new Error("Error occurred while finding user.");
        }
    }
};
exports.EmployeeService = EmployeeService;
exports.EmployeeService = EmployeeService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(employee_entity_1.EmployeeEntity)),
    __param(1, (0, typeorm_1.InjectRepository)(auth_entity_1.AuthenticationEntity)),
    __param(2, (0, typeorm_1.InjectRepository)(Account_entity_1.AccountEntity)),
    __param(3, (0, typeorm_1.InjectRepository)(transaction_entity_1.TransactionEntity)),
    __param(4, (0, typeorm_1.InjectRepository)(service_entity_1.ServiceEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        jwt_1.JwtService,
        mailer_service_1.EmailService])
], EmployeeService);
//# sourceMappingURL=employee.service.js.map