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
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmployeeEntity = void 0;
const Account_entity_1 = require("./Account.entity");
const transaction_entity_1 = require("./transaction.entity");
const auth_entity_1 = require("../../Authentication/auth.entity");
const typeorm_1 = require("typeorm");
let EmployeeEntity = class EmployeeEntity {
    generateId() {
        const randomNumber = Math.floor(100000 + Math.random() * 900000).toString();
        this.userId = 'E-' + randomNumber;
        return this.userId;
    }
    generateUserId() {
        const randomNumber = Math.floor(100000 + Math.random() * 900000).toString();
        this.userId = 'U-' + randomNumber;
        return this.userId;
    }
};
exports.EmployeeEntity = EmployeeEntity;
__decorate([
    (0, typeorm_1.PrimaryColumn)({ type: "varchar" }),
    __metadata("design:type", String)
], EmployeeEntity.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'FulName', type: 'varchar', length: 150 }),
    __metadata("design:type", String)
], EmployeeEntity.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'Gender', type: 'varchar', length: 6 }),
    __metadata("design:type", String)
], EmployeeEntity.prototype, "gender", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'DOB', type: Date }),
    __metadata("design:type", Date)
], EmployeeEntity.prototype, "dob", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'NID', unique: true }),
    __metadata("design:type", Number)
], EmployeeEntity.prototype, "nid", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'Phone', type: 'varchar' }),
    __metadata("design:type", String)
], EmployeeEntity.prototype, "phone", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'Address' }),
    __metadata("design:type", String)
], EmployeeEntity.prototype, "address", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'FileName' }),
    __metadata("design:type", String)
], EmployeeEntity.prototype, "filename", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => auth_entity_1.AuthenticationEntity, Authentication => Authentication.users, { cascade: true, onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'Email' }),
    __metadata("design:type", auth_entity_1.AuthenticationEntity)
], EmployeeEntity.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Account_entity_1.AccountEntity, Accounts => Accounts.userId, { cascade: true, onDelete: 'CASCADE' }),
    __metadata("design:type", Array)
], EmployeeEntity.prototype, "Accounts", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => transaction_entity_1.TransactionEntity, Transactions => Transactions.userId),
    __metadata("design:type", Array)
], EmployeeEntity.prototype, "Transactions", void 0);
exports.EmployeeEntity = EmployeeEntity = __decorate([
    (0, typeorm_1.Entity)("Users")
], EmployeeEntity);
//# sourceMappingURL=employee.entity.js.map