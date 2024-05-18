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
exports.EmployeeController = void 0;
const common_1 = require("@nestjs/common");
const employee_service_1 = require("./employee.service");
const employee_dto_1 = require("./employee.dto");
const platform_express_1 = require("@nestjs/platform-express");
const multer_1 = require("multer");
const auth_guard_1 = require("../Authentication/auth.guard");
const bcrypt = require("bcrypt");
const roles_decorator_1 = require("../CustomDecorator/roles.decorator");
let EmployeeController = class EmployeeController {
    constructor(employeeService) {
        this.employeeService = employeeService;
    }
    getUsers() {
        return this.employeeService.getUsers();
    }
    async createAccount(myobj, myfile) {
        const salt = await bcrypt.genSalt();
        const hashedpassword = await bcrypt.hash(myobj.password, salt);
        myobj.password = hashedpassword;
        myobj.filename = myfile.filename;
        return this.employeeService.createAccount(myobj);
    }
    deleteEmployee(userId) {
        return this.employeeService.deleteEmployee(userId);
    }
    async updateEmployee(userId, myobj, myfile) {
        const salt = await bcrypt.genSalt();
        const hashedpassword = await bcrypt.hash(myobj.password, salt);
        myobj.password = hashedpassword;
        myobj.filename = myfile.filename;
        return this.employeeService.updateEmployee(userId, myobj);
    }
    getEmployeeAccountInfo() {
        return this.employeeService.getAccountInfo();
    }
    getEmployeeAccountInfoById(userId) {
        return this.employeeService.getAccountInfoById(userId);
    }
    getProfile(session) {
        if (session && session['email']) {
            const userEmail = session['email'];
            console.log(userEmail);
            return this.employeeService.getProfile(userEmail);
        }
        throw new common_1.NotFoundException('No data in session');
    }
    updateProfile(session, myobj, myfile) {
        if (session && session['email']) {
            const userEmail = session['email'];
            console.log(userEmail);
            myobj.filename = myfile.filename;
            return this.employeeService.updateProfile(userEmail, myobj);
        }
        throw new common_1.NotFoundException('No data in the session');
    }
    passwordChange(myobj, session) {
        if (session && session['email']) {
            const userEmail = session['email'];
            console.log("Session Data:", userEmail);
            return this.employeeService.passwordChange(userEmail, myobj);
        }
        throw new common_1.NotFoundException('No data in the session');
    }
    getInactiveUserAccount() {
        return this.employeeService.getInactiveUserAccount();
    }
    activateUserAccount(userId) {
        return this.employeeService.activateUserAccount(userId);
    }
    deactivateUserAccount(userId) {
        return this.employeeService.deactivateUserAccount(userId);
    }
    getUserAccountInfo() {
        return this.employeeService.getUserAccountInfo();
    }
    getTransactionHistory() {
        return this.employeeService.getTransactionHistory();
    }
    getTransactionHistoryByUserId(userId) {
        return this.employeeService.getTransactionHistoryByUserId(userId);
    }
    getTransactionHistoryByTransactionId(transactionId) {
        return this.employeeService.getTransactionHistoryByTransactionId(transactionId);
    }
    getIncompleteTransfer() {
        return this.employeeService.getIncompleteTransfer();
    }
    confirmTransfer(transactionId) {
        return this.employeeService.confirmTransfer(transactionId);
    }
    getAllServiceRequiest() {
        return this.employeeService.getAllServiceRequiest();
    }
    getServiceRequiestById(serviceId) {
        return this.employeeService.getServiceRequiestById(serviceId);
    }
    processServiceRequiestById(serviceId) {
        return this.employeeService.processServiceRequiestById(serviceId);
    }
    sendVerificationReportToManager(serviceId) {
        return this.employeeService.sendVerificationReportToManager(serviceId);
    }
    openFile(name, res) {
        res.sendFile(name, { root: './upload' });
    }
};
exports.EmployeeController = EmployeeController;
__decorate([
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Object)
], EmployeeController.prototype, "getUsers", null);
__decorate([
    (0, common_1.Post)('/createAccount'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('myfile', {
        fileFilter: (req, file, cb) => {
            if (file.originalname.match(/^.*\.(jpg|webp|png|jpeg)$/))
                cb(null, true);
            else {
                cb(new multer_1.MulterError('LIMIT_UNEXPECTED_FILE', 'image'), false);
            }
        },
        limits: { fileSize: 300000000 },
        storage: (0, multer_1.diskStorage)({
            destination: './upload',
            filename: function (req, file, cb) {
                cb(null, Date.now() + file.originalname);
            },
        })
    })),
    (0, common_1.UsePipes)(new common_1.ValidationPipe),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [employee_dto_1.EmployeeDTO, Object]),
    __metadata("design:returntype", Promise)
], EmployeeController.prototype, "createAccount", null);
__decorate([
    (0, common_1.Delete)('deleteEmployee/:userId'),
    __param(0, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Object)
], EmployeeController.prototype, "deleteEmployee", null);
__decorate([
    (0, common_1.Put)('updateEmployee/:userId'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, roles_decorator_1.Roles)('Account Officer'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('myfile', {
        fileFilter: (req, file, cb) => {
            if (file.originalname.match(/^.*\.(jpg|webp|png|jpeg)$/))
                cb(null, true);
            else {
                cb(new multer_1.MulterError('LIMIT_UNEXPECTED_FILE', 'image'), false);
            }
        },
        limits: { fileSize: 300000000 },
        storage: (0, multer_1.diskStorage)({
            destination: './upload',
            filename: function (req, file, cb) {
                cb(null, Date.now() + file.originalname);
            },
        })
    })),
    (0, common_1.UsePipes)(new common_1.ValidationPipe()),
    __param(0, (0, common_1.Param)('userId')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, employee_dto_1.EmployeeDTO, Object]),
    __metadata("design:returntype", Promise)
], EmployeeController.prototype, "updateEmployee", null);
__decorate([
    (0, common_1.Get)('/getEmployeeAccount'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], EmployeeController.prototype, "getEmployeeAccountInfo", null);
__decorate([
    (0, common_1.Get)('/getEmployeeAccount/:userId'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, roles_decorator_1.Roles)('Account Officer'),
    __param(0, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], EmployeeController.prototype, "getEmployeeAccountInfoById", null);
__decorate([
    (0, common_1.Get)('/Profile'),
    __param(0, (0, common_1.Session)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], EmployeeController.prototype, "getProfile", null);
__decorate([
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, common_1.Put)('/updateProfile'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('myfile', {
        fileFilter: (req, file, cb) => {
            if (file.originalname.match(/^.*\.(jpg|webp|png|jpeg)$/))
                cb(null, true);
            else {
                cb(new multer_1.MulterError('LIMIT_UNEXPECTED_FILE', 'image'), false);
            }
        },
        limits: { fileSize: 300000000 },
        storage: (0, multer_1.diskStorage)({
            destination: './upload',
            filename: function (req, file, cb) {
                cb(null, Date.now() + file.originalname);
            },
        })
    })),
    __param(0, (0, common_1.Session)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, employee_dto_1.profileDTO, Object]),
    __metadata("design:returntype", Promise)
], EmployeeController.prototype, "updateProfile", null);
__decorate([
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, common_1.Patch)('changePassword'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Session)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [employee_dto_1.changePasswordDTO, Object]),
    __metadata("design:returntype", Promise)
], EmployeeController.prototype, "passwordChange", null);
__decorate([
    (0, common_1.Get)('/getInactiveUserAccount'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, roles_decorator_1.Roles)('Account Officer'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], EmployeeController.prototype, "getInactiveUserAccount", null);
__decorate([
    (0, common_1.Patch)('activateUserAccount/:userId'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, roles_decorator_1.Roles)('Account Officer'),
    __param(0, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], EmployeeController.prototype, "activateUserAccount", null);
__decorate([
    (0, common_1.Patch)('deActivateUserAccount/:userId'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, roles_decorator_1.Roles)('Account Officer'),
    __param(0, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], EmployeeController.prototype, "deactivateUserAccount", null);
__decorate([
    (0, common_1.Get)('/getUserAccount'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, roles_decorator_1.Roles)('Account Officer'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], EmployeeController.prototype, "getUserAccountInfo", null);
__decorate([
    (0, common_1.Get)('/getUserTransactionHistory'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, roles_decorator_1.Roles)('Account Officer', 'Accountent'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], EmployeeController.prototype, "getTransactionHistory", null);
__decorate([
    (0, common_1.Get)('getTransactionHistoryByUserId/:userId'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, roles_decorator_1.Roles)('Account Officer', 'Accountent'),
    __param(0, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], EmployeeController.prototype, "getTransactionHistoryByUserId", null);
__decorate([
    (0, common_1.Get)('getTransactionHistoryByTransactionId/:transactionId'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, roles_decorator_1.Roles)('Account Officer', 'Accountent'),
    __param(0, (0, common_1.Param)('transactionId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], EmployeeController.prototype, "getTransactionHistoryByTransactionId", null);
__decorate([
    (0, common_1.Get)('/getIncompleteTransfer'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, roles_decorator_1.Roles)('Accountent'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], EmployeeController.prototype, "getIncompleteTransfer", null);
__decorate([
    (0, common_1.Patch)('confirmTransfer/:transactionId'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, roles_decorator_1.Roles)('Accountent'),
    __param(0, (0, common_1.Param)('transactionId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], EmployeeController.prototype, "confirmTransfer", null);
__decorate([
    (0, common_1.Get)('/getAllServiceRequiest'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, roles_decorator_1.Roles)('Accountent'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], EmployeeController.prototype, "getAllServiceRequiest", null);
__decorate([
    (0, common_1.Get)('getServiceRequiestById/:serviceId'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, roles_decorator_1.Roles)('Accountent'),
    __param(0, (0, common_1.Param)('serviceId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], EmployeeController.prototype, "getServiceRequiestById", null);
__decorate([
    (0, common_1.Patch)('processServiceRequiestById/:serviceId'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, roles_decorator_1.Roles)('Accountent'),
    __param(0, (0, common_1.Param)('serviceId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], EmployeeController.prototype, "processServiceRequiestById", null);
__decorate([
    (0, common_1.Get)('sendVerificationReportToManager/:serviceId'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, roles_decorator_1.Roles)('Accountent'),
    __param(0, (0, common_1.Param)('serviceId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], EmployeeController.prototype, "sendVerificationReportToManager", null);
__decorate([
    (0, common_1.Get)('/openFile/:name'),
    __param(0, (0, common_1.Param)('name')),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], EmployeeController.prototype, "openFile", null);
exports.EmployeeController = EmployeeController = __decorate([
    (0, common_1.Controller)('/employee'),
    __metadata("design:paramtypes", [employee_service_1.EmployeeService])
], EmployeeController);
//# sourceMappingURL=employee.controller.js.map