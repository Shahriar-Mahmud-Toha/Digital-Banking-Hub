"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmployeeModule = void 0;
const common_1 = require("@nestjs/common");
const employee_controller_1 = require("./employee.controller");
const employee_service_1 = require("./employee.service");
const typeorm_1 = require("@nestjs/typeorm");
const employee_entity_1 = require("./Entity/employee.entity");
const jwt_module_1 = require("@nestjs/jwt/dist/jwt.module");
const auth_service_1 = require("../Authentication/auth.service");
const auth_entity_1 = require("../Authentication/auth.entity");
const Account_entity_1 = require("./Entity/Account.entity");
const transaction_entity_1 = require("./Entity/transaction.entity");
const service_entity_1 = require("./Entity/service.entity");
const mailer_service_1 = require("./Mailer/mailer.service");
const user_service_1 = require("../User/user.service");
const mailer_sevice_1 = require("../User/UserMailer/mailer.sevice");
const constants_1 = require("../Authentication/constants");
let EmployeeModule = class EmployeeModule {
};
exports.EmployeeModule = EmployeeModule;
exports.EmployeeModule = EmployeeModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([employee_entity_1.EmployeeEntity, auth_entity_1.AuthenticationEntity, Account_entity_1.AccountEntity, transaction_entity_1.TransactionEntity, service_entity_1.ServiceEntity]),
            jwt_module_1.JwtModule.register({
                global: true,
                secret: constants_1.jwtConstants.secret,
                signOptions: { expiresIn: '60m' },
            }),
        ],
        controllers: [employee_controller_1.EmployeeController],
        providers: [employee_service_1.EmployeeService, auth_service_1.AuthService, mailer_service_1.EmailService, user_service_1.UserService, mailer_sevice_1.UserEmailService],
        exports: [employee_service_1.EmployeeService],
    })
], EmployeeModule);
//# sourceMappingURL=employee.module.js.map