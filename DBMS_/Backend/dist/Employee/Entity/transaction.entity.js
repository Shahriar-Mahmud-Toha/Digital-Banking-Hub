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
exports.TransactionEntity = void 0;
const employee_entity_1 = require("./employee.entity");
const typeorm_1 = require("typeorm");
let TransactionEntity = class TransactionEntity {
    generateId() {
        const randomNumber = Math.floor(10000 + Math.random() * 90000).toString();
        this.transactionId = 'T-' + randomNumber;
        return this.transactionId;
    }
};
exports.TransactionEntity = TransactionEntity;
__decorate([
    (0, typeorm_1.PrimaryColumn)({ type: "varchar" }),
    __metadata("design:type", String)
], TransactionEntity.prototype, "transactionId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'AccountNumber' }),
    __metadata("design:type", Number)
], TransactionEntity.prototype, "acountNumber", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'Amount' }),
    __metadata("design:type", Number)
], TransactionEntity.prototype, "amount", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'ReceiverAccount' }),
    __metadata("design:type", Number)
], TransactionEntity.prototype, "receiverAccount", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'AccountHolderName', length: 100, type: "varchar" }),
    __metadata("design:type", String)
], TransactionEntity.prototype, "holderName", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'AccountType', length: 100, type: "varchar" }),
    __metadata("design:type", String)
], TransactionEntity.prototype, "accountType", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'BankCode' }),
    __metadata("design:type", Number)
], TransactionEntity.prototype, "bankCode", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'RoutingNumber' }),
    __metadata("design:type", Number)
], TransactionEntity.prototype, "routingNumber", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'TransferType', length: 20, type: "varchar" }),
    __metadata("design:type", String)
], TransactionEntity.prototype, "transferType", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'Status', default: true }),
    __metadata("design:type", Boolean)
], TransactionEntity.prototype, "transactionStatus", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'TransactionTime' }),
    __metadata("design:type", Date)
], TransactionEntity.prototype, "applicationTime", void 0);
__decorate([
    (0, typeorm_1.BeforeInsert)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", String)
], TransactionEntity.prototype, "generateId", null);
__decorate([
    (0, typeorm_1.ManyToOne)(() => employee_entity_1.EmployeeEntity, Users => Users.Transactions),
    (0, typeorm_1.JoinColumn)({ name: 'User_ID' }),
    __metadata("design:type", employee_entity_1.EmployeeEntity)
], TransactionEntity.prototype, "userId", void 0);
exports.TransactionEntity = TransactionEntity = __decorate([
    (0, typeorm_1.Entity)("Transaction")
], TransactionEntity);
//# sourceMappingURL=transaction.entity.js.map