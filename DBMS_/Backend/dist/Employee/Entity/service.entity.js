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
exports.ServiceEntity = void 0;
const Account_entity_1 = require("./Account.entity");
const typeorm_1 = require("typeorm");
let ServiceEntity = class ServiceEntity {
};
exports.ServiceEntity = ServiceEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], ServiceEntity.prototype, "serviceId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'ServiceType', type: 'varchar', length: 50 }),
    __metadata("design:type", String)
], ServiceEntity.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'Document' }),
    __metadata("design:type", String)
], ServiceEntity.prototype, "filename", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'Status', default: false }),
    __metadata("design:type", Boolean)
], ServiceEntity.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'ApplicationTime' }),
    __metadata("design:type", Date)
], ServiceEntity.prototype, "applicationTime", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Account_entity_1.AccountEntity, account => account.services),
    (0, typeorm_1.JoinColumn)({ name: 'AccountNumber' }),
    __metadata("design:type", Account_entity_1.AccountEntity)
], ServiceEntity.prototype, "account", void 0);
exports.ServiceEntity = ServiceEntity = __decorate([
    (0, typeorm_1.Entity)("Services")
], ServiceEntity);
//# sourceMappingURL=service.entity.js.map