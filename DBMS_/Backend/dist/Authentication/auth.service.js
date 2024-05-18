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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const employee_service_1 = require("../Employee/employee.service");
const user_service_1 = require("../User/user.service");
const bcrypt = require("bcrypt");
let AuthService = class AuthService {
    constructor(userService, employeeService, jwtService) {
        this.userService = userService;
        this.employeeService = employeeService;
        this.jwtService = jwtService;
    }
    async signUp(myobj) {
        return await this.userService.addAccount(myobj);
    }
    async signIn(logindata, session) {
        try {
            const user = await this.employeeService.findOne(logindata);
            console.log(user.users.userId);
            if (!user) {
                throw new common_1.UnauthorizedException("This Account is Not Found");
            }
            if (user.isActive == false) {
                throw new common_1.UnauthorizedException("Your Account Is Not Active.");
            }
            const isMatch = await bcrypt.compare(logindata.password, user.password);
            if (!isMatch) {
                throw new common_1.UnauthorizedException("Please Give Valid Data");
            }
            const payload = { email: user.email, role: user.role };
            console.log('User Roles Service:', user.role);
            session['email'] = user.email;
            session['userId'] = user.users.userId;
            console.log(session['email']);
            return {
                access_token: await this.jwtService.signAsync(payload),
            };
        }
        catch (error) {
            throw error;
        }
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [user_service_1.UserService,
        employee_service_1.EmployeeService,
        jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map