"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserModule = void 0;
const common_1 = require("@nestjs/common");
const user_controller_1 = require("./user.controller");
const user_service_1 = require("./user.service");
const typeorm_1 = require("@nestjs/typeorm");
const employee_entity_1 = require("../Employee/Entity/employee.entity");
const auth_entity_1 = require("../Authentication/auth.entity");
const jwt_1 = require("@nestjs/jwt");
const mailer_sevice_1 = require("./UserMailer/mailer.sevice");
const auth_service_1 = require("../Authentication/auth.service");
const auth_controller_1 = require("../Authentication/auth.controller");
const Account_entity_1 = require("../Employee/Entity/Account.entity");
const transaction_entity_1 = require("../Employee/Entity/transaction.entity");
const service_entity_1 = require("../Employee/Entity/service.entity");
const employee_service_1 = require("../Employee/employee.service");
const mailer_service_1 = require("../Employee/Mailer/mailer.service");
const constants_1 = require("../Authentication/constants");
let UserModule = class UserModule {
};
exports.UserModule = UserModule;
exports.UserModule = UserModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([
                employee_entity_1.EmployeeEntity,
                auth_entity_1.AuthenticationEntity,
                Account_entity_1.AccountEntity,
                transaction_entity_1.TransactionEntity,
                service_entity_1.ServiceEntity,
            ]),
            jwt_1.JwtModule.register({
                global: true,
                secret: constants_1.jwtConstants.secret,
                signOptions: { expiresIn: '60m' },
            }),
        ],
        controllers: [user_controller_1.UserController, auth_controller_1.AuthController],
        providers: [user_service_1.UserService, mailer_sevice_1.UserEmailService, auth_service_1.AuthService, employee_service_1.EmployeeService, mailer_service_1.EmailService],
        exports: [user_service_1.UserService],
    })
], UserModule);
//# sourceMappingURL=user.module.js.map