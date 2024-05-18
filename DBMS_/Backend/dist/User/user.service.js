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
exports.UserService = void 0;
const common_1 = require("@nestjs/common");
const user_dto_1 = require("./UserDTO/user.dto");
const employee_entity_1 = require("../Employee/Entity/employee.entity");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const auth_entity_1 = require("../Authentication/auth.entity");
const jwt_1 = require("@nestjs/jwt");
const mailer_sevice_1 = require("./UserMailer/mailer.sevice");
const Account_entity_1 = require("../Employee/Entity/Account.entity");
const transaction_entity_1 = require("../Employee/Entity/transaction.entity");
const service_entity_1 = require("../Employee/Entity/service.entity");
const path_1 = require("path");
const fs = require("fs");
let UserService = class UserService {
    constructor(userRepository, jwtService, emailService, authRepository, accountRepository, tansactionRepository, serviceRepository) {
        this.userRepository = userRepository;
        this.jwtService = jwtService;
        this.emailService = emailService;
        this.authRepository = authRepository;
        this.accountRepository = accountRepository;
        this.tansactionRepository = tansactionRepository;
        this.serviceRepository = serviceRepository;
    }
    getUser() {
        return "hello";
    }
    async addAccount(myobj) {
        const userRegistration = new employee_entity_1.EmployeeEntity();
        userRegistration.userId = userRegistration.generateUserId();
        userRegistration.name = myobj.name;
        userRegistration.gender = myobj.gender;
        userRegistration.dob = myobj.dob;
        userRegistration.nid = myobj.nid;
        userRegistration.phone = myobj.phone;
        userRegistration.address = myobj.address;
        userRegistration.filename = myobj.filename;
        userRegistration.email = new auth_entity_1.AuthenticationEntity();
        userRegistration.email.email = myobj.email;
        userRegistration.email.password = myobj.password;
        userRegistration.email.role = "User";
        userRegistration.email.isActive = true;
        const account = new Account_entity_1.AccountEntity();
        account.userId = userRegistration;
        account.name = myobj.nomineeName;
        account.gender = myobj.nomineeGender;
        account.dob = myobj.nomineedob;
        account.nid = myobj.nomineenNid;
        account.phone = myobj.nomineephone;
        account.address = myobj.nomineeAddress;
        account.accountNumber = account.generateAccountNumber();
        account.filename = myobj.nomineeFilename;
        account.accountType = myobj.accountType;
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
        const body = "Your Account has been created at : " + loginTime;
        await this.emailService.sendMail(myobj.email, subject, body);
        return myobj;
    }
    async getUserProfilePictureById(userId) {
        const user = await this.userRepository.findOne({ select: { filename: true, name: true }, where: { userId: userId } });
        if (!user || !user.filename) {
            throw new common_1.NotFoundException('User profile picture not found');
        }
        return { name: user.name, fileName: user.filename };
    }
    async getUserProfile(id) {
        return this.userRepository.find({ where: { userId: id } });
    }
    async getUserProfileAllInfo(email) {
        try {
            const userInfo = await this.authRepository.findOne({ where: { email: email }, relations: ['users'] });
            const userid = userInfo.users.userId;
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
                account: user.Accounts[1],
            };
        }
        catch (error) {
            console.error('Error retrieving user profile:', error);
            return 'Error retrieving user profile';
        }
    }
    async deposit(myobj) {
        console.log("Attempting to insert/update database with account number:", myobj.accountNumber);
        console.log("Withdraw amount:", myobj.amount);
        if (isNaN(myobj.amount)) {
            throw new Error('Amount is not a valid number');
        }
        const user = await this.accountRepository.findOne({ where: { accountNumber: myobj.accountNumber }, relations: ['userId'],
        });
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        if (myobj.amount < 0) {
            throw new Error('Enter a valid amount: ' + user.balance);
        }
        const transaction = new transaction_entity_1.TransactionEntity();
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
    async withdraw(myobj) {
        console.log("Attempting to insert/update database with account number:", myobj.accountNumber);
        console.log("Withdraw amount:", myobj.amount);
        if (isNaN(myobj.amount)) {
            throw new Error('Amount is not a valid number');
        }
        const user = await this.accountRepository.findOne({ where: { accountNumber: myobj.accountNumber }, relations: ['userId'],
        });
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        console.log(user);
        if (user.balance < myobj.amount) {
            throw new common_1.NotFoundException('Insufficient balance for withdrawal. Current balance is: ' + user.balance);
        }
        const transaction = new transaction_entity_1.TransactionEntity();
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
    async getUserInfoAndTransactions(id) {
        const user = await this.userRepository.findOne({ where: { userId: id } });
        const transactions = await this.tansactionRepository.find({
            relations: ['userId'],
        });
        return { user, transactions };
    }
    async makeRequest(myobj, session) {
        const user = await this.accountRepository.findOne({ where: { accountNumber: myobj.accountNumber }, relations: ['userId'],
        });
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        const Service = new service_entity_1.ServiceEntity();
        Service.name = myobj.name;
        Service.filename = myobj.filename;
        Service.applicationTime = new Date();
        Service.status = true;
        Service.account = new Account_entity_1.AccountEntity();
        Service.account.accountNumber = myobj.accountNumber;
        await this.serviceRepository.save(Service);
        return myobj;
    }
    async updateUserProfilePicture(id, filename) {
        const user = await this.userRepository.findOneBy({ userId: id });
        if (!user) {
            throw new Error('User not found');
        }
        user.filename = filename;
        await this.userRepository.save(user);
    }
    async deleteUserProfilePicture(userId) {
        const user = await this.userRepository.findOneBy({ userId });
        if (!user) {
            throw new Error('User not found');
        }
        if (user.filename) {
            const filePath = path_1.default.join('./upload', user.filename);
            fs.unlink(filePath, (err) => {
                if (err) {
                    console.error('Failed to delete local file', err);
                }
            });
        }
        user.filename = null;
        await this.userRepository.save(user);
    }
    async getProfile(id) {
        return this.userRepository.find({ where: { userId: id } });
    }
    async getUsersByEmail(email) {
        const result = await this.authRepository.findOne({
            where: {
                email: email,
            }, relations: ['users']
        });
        console.log(result);
        return result;
    }
    async getAllUsers() {
        return await this.userRepository.find();
    }
    async getUserAc(id) {
        return this.userRepository.find({ where: { userId: id }, relations: ['Accounts'] });
    }
    async updateProfile(userEmail, myobj) {
        try {
            const account = await this.authRepository.findOne({ where: { email: userEmail }, relations: ['users'] });
            if (!account) {
                throw new common_1.NotFoundException('User not found');
            }
            const User = new employee_entity_1.EmployeeEntity();
            User.userId = account.users.userId;
            User.name = myobj.name;
            User.phone = myobj.phone;
            User.address = myobj.address;
            User.email = new auth_entity_1.AuthenticationEntity();
            User.email.email = account.email;
            User.email.password = account.password;
            console.log(myobj.email);
            console.log("AC MAIL" + account.email);
            if (account.users.userId !== myobj.userId) {
                return "user id Cannot be ";
            }
            await this.userRepository.save(User);
            await this.authRepository.save(User.email);
            const updatedInfo = await this.authRepository.findOne({ where: { email: userEmail }, relations: ['users'] });
            const userInfo = new user_dto_1.profileDTO();
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
        }
        catch (error) {
            throw new Error("Error occurred while updating user profile.");
        }
    }
    async getUserInfoAndTransaction(id) {
        const user = await this.userRepository.findOne({ where: { userId: id } });
        const transactions = await this.tansactionRepository.find({
            relations: ['userId'],
        });
        return { user, transactions };
    }
};
exports.UserService = UserService;
exports.UserService = UserService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(employee_entity_1.EmployeeEntity)),
    __param(3, (0, typeorm_1.InjectRepository)(auth_entity_1.AuthenticationEntity)),
    __param(4, (0, typeorm_1.InjectRepository)(Account_entity_1.AccountEntity)),
    __param(5, (0, typeorm_1.InjectRepository)(transaction_entity_1.TransactionEntity)),
    __param(6, (0, typeorm_1.InjectRepository)(service_entity_1.ServiceEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        jwt_1.JwtService,
        mailer_sevice_1.UserEmailService,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], UserService);
//# sourceMappingURL=user.service.js.map