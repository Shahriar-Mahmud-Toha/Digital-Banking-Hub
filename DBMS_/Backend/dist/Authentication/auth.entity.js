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
exports.AuthenticationEntity = void 0;
const employee_entity_1 = require("../Employee/Entity/employee.entity");
const typeorm_1 = require("typeorm");
let AuthenticationEntity = class AuthenticationEntity {
};
exports.AuthenticationEntity = AuthenticationEntity;
__decorate([
    (0, typeorm_1.PrimaryColumn)({ name: 'Email', type: 'varchar', length: 100 }),
    __metadata("design:type", String)
], AuthenticationEntity.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar' }),
    __metadata("design:type", String)
], AuthenticationEntity.prototype, "password", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'Role', type: 'varchar', length: 20 }),
    __metadata("design:type", String)
], AuthenticationEntity.prototype, "role", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'Active', default: false }),
    __metadata("design:type", Boolean)
], AuthenticationEntity.prototype, "isActive", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => employee_entity_1.EmployeeEntity, Users => Users.email),
    __metadata("design:type", employee_entity_1.EmployeeEntity)
], AuthenticationEntity.prototype, "users", void 0);
exports.AuthenticationEntity = AuthenticationEntity = __decorate([
    (0, typeorm_1.Entity)("Authentication")
], AuthenticationEntity);
//# sourceMappingURL=auth.entity.js.map