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
exports.AccountEntity = void 0;
const employee_entity_1 = require("./employee.entity");
const service_entity_1 = require("./service.entity");
const typeorm_1 = require("typeorm");
let AccountEntity = class AccountEntity {
    generateAccountNumber() {
        const randomNumber = Math.floor(10000000 + Math.random() * 90000000);
        this.accountNumber = randomNumber;
        return this.accountNumber;
    }
};
exports.AccountEntity = AccountEntity;
__decorate([
    (0, typeorm_1.PrimaryColumn)({ name: 'AccountNumber' }),
    __metadata("design:type", Number)
], AccountEntity.prototype, "accountNumber", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'NomineeName', type: 'varchar', length: 150 }),
    __metadata("design:type", String)
], AccountEntity.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'Gender', type: 'varchar', length: 6 }),
    __metadata("design:type", String)
], AccountEntity.prototype, "gender", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'DOB', type: 'date' }),
    __metadata("design:type", Date)
], AccountEntity.prototype, "dob", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'NID', unique: true }),
    __metadata("design:type", Number)
], AccountEntity.prototype, "nid", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'Phone', type: 'varchar' }),
    __metadata("design:type", String)
], AccountEntity.prototype, "phone", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'Address' }),
    __metadata("design:type", String)
], AccountEntity.prototype, "address", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'NomineePicture' }),
    __metadata("design:type", String)
], AccountEntity.prototype, "filename", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'AccountType', type: 'varchar', nullable: true }),
    __metadata("design:type", String)
], AccountEntity.prototype, "accountType", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'Balance', default: 0, nullable: true }),
    __metadata("design:type", Number)
], AccountEntity.prototype, "balance", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'AccountStatus', default: true }),
    __metadata("design:type", Boolean)
], AccountEntity.prototype, "accountStatus", void 0);
__decorate([
    (0, typeorm_1.BeforeInsert)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Number)
], AccountEntity.prototype, "generateAccountNumber", null);
__decorate([
    (0, typeorm_1.ManyToOne)(() => employee_entity_1.EmployeeEntity, Users => Users.Accounts),
    (0, typeorm_1.JoinColumn)({ name: 'User_ID' }),
    __metadata("design:type", employee_entity_1.EmployeeEntity)
], AccountEntity.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => service_entity_1.ServiceEntity, service => service.account),
    __metadata("design:type", Array)
], AccountEntity.prototype, "services", void 0);
exports.AccountEntity = AccountEntity = __decorate([
    (0, typeorm_1.Entity)("AccountInfo")
], AccountEntity);
//# sourceMappingURL=Account.entity.js.map