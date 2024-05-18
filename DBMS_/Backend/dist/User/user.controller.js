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
exports.UserController = void 0;
const common_1 = require("@nestjs/common");
const user_service_1 = require("./user.service");
const user_dto_1 = require("./UserDTO/user.dto");
const platform_express_1 = require("@nestjs/platform-express");
const multer_1 = require("multer");
const auth_guard_1 = require("../Authentication/auth.guard");
const user_transaction_dto_1 = require("./UserDTO/user.transaction.dto");
const user_service_dto_1 = require("./UserDTO/user.service.dto");
const roles_decorator_1 = require("../CustomDecorator/roles.decorator");
let UserController = class UserController {
    constructor(userService) {
        this.userService = userService;
    }
    getUser() {
        return this.userService.getUser();
    }
    async getUserProfilePictureById(userId, res, session) {
        const profilePicture = (await this.userService.getUserProfilePictureById(userId)).fileName;
        const name = (await this.userService.getUserProfilePictureById(userId)).name;
        res.sendFile(profilePicture, { root: './upload' });
    }
    getUsersByEmail(email) {
        return this.userService.getUsersByEmail(email);
    }
    getUserProfile(session) {
        if (session && session['userId']) {
            const userId = session['userId'];
            console.log(userId);
            return this.userService.getProfile(userId);
        }
        throw new common_1.NotFoundException('No data in session');
    }
    getUserProfileAllInfo(session) {
        console.log(session.email);
        return this.userService.getUserProfileAllInfo(session.email);
    }
    async deposit(myobj) {
        {
            try {
                return await this.userService.deposit(myobj);
            }
            catch (error) {
                if (error instanceof common_1.NotFoundException) {
                    throw error;
                }
                throw new Error('Withdrawal failed');
            }
        }
    }
    async withdraw(myobj) {
        {
            try {
                return await this.userService.withdraw(myobj);
            }
            catch (error) {
                if (error instanceof common_1.NotFoundException) {
                    throw error;
                }
                throw new Error('Withdrawal failed');
            }
        }
    }
    async getUserInfoAndTransactions(session) {
        return this.userService.getUserInfoAndTransactions(session.userid);
    }
    async makeRequest(session, myobj, myFiles) {
        if (!myFiles || myFiles.length === 0) {
            return 'No file uploaded';
        }
        const firstFile = myFiles[0];
        if (!firstFile.filename) {
            return 'Uploaded file has no filename';
        }
        myobj.filename = firstFile.filename;
        console.log(myobj.filename);
        return this.userService.makeRequest(myobj, session);
    }
    async updateProfilePicture(session, myFiles) {
        const firstFile = myFiles[0];
        await this.userService.updateUserProfilePicture(session.userid, firstFile.filename);
        return { message: 'Profile picture updated successfully.' };
    }
    async deleteProfilePicture(session) {
        await this.userService.deleteUserProfilePicture(session.userid);
        return { message: 'Profile picture deleted successfully.' };
    }
    getProfile(userId) {
        return this.userService.getUserProfile(userId);
    }
    getImages(name, res) {
        res.sendFile(name, { root: './upload' });
    }
    getAll() {
        return this.userService.getAllUsers();
    }
    getUserAc(session) {
        if (session && session['userId']) {
            const userId = session['userId'];
            console.log(userId);
            return this.userService.getUserAc(userId);
        }
        throw new common_1.NotFoundException('No data in session');
    }
    getUserAcc(userId) {
        return this.userService.getUserAc(userId);
    }
    updateProfile(email, myobj) {
        return this.userService.updateProfile(email, myobj);
    }
    async getUserInfoAndTransaction(id) {
        return this.userService.getUserInfoAndTransactions(id);
    }
};
exports.UserController = UserController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", String)
], UserController.prototype, "getUser", null);
__decorate([
    (0, roles_decorator_1.Roles)('User'),
    (0, common_1.Get)('/profile-picture/:userId'),
    __param(0, (0, common_1.Param)('userId')),
    __param(1, (0, common_1.Res)()),
    __param(2, (0, common_1.Session)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getUserProfilePictureById", null);
__decorate([
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, common_1.Get)('/getusers/:email'),
    __param(0, (0, common_1.Param)('email')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Object)
], UserController.prototype, "getUsersByEmail", null);
__decorate([
    (0, common_1.Get)('/getProfileInfo'),
    __param(0, (0, common_1.Session)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Object)
], UserController.prototype, "getUserProfile", null);
__decorate([
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, roles_decorator_1.Roles)('User'),
    (0, common_1.Get)('/getAll/'),
    __param(0, (0, common_1.Session)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Object)
], UserController.prototype, "getUserProfileAllInfo", null);
__decorate([
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, roles_decorator_1.Roles)('User'),
    (0, common_1.Patch)('/deposit/'),
    (0, common_1.UsePipes)(new common_1.ValidationPipe()),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_transaction_dto_1.transactionDto]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "deposit", null);
__decorate([
    (0, common_1.Patch)('/withdraw/'),
    (0, common_1.UsePipes)(new common_1.ValidationPipe()),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_transaction_dto_1.transactionDto]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "withdraw", null);
__decorate([
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, roles_decorator_1.Roles)('User'),
    (0, common_1.Get)('info-and-transactions/'),
    __param(0, (0, common_1.Session)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getUserInfoAndTransactions", null);
__decorate([
    (0, roles_decorator_1.Roles)('User'),
    (0, common_1.Post)('makeServiceRequest'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FilesInterceptor)('myFiles', 1, {
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
    __param(0, (0, common_1.Session)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.UploadedFiles)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, user_service_dto_1.serviceDTO, Array]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "makeRequest", null);
__decorate([
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, roles_decorator_1.Roles)('User'),
    (0, common_1.Post)('/update-profile-picture'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FilesInterceptor)('myFiles', 1, {
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
    __param(0, (0, common_1.Session)()),
    __param(1, (0, common_1.UploadedFiles)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Array]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "updateProfilePicture", null);
__decorate([
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, roles_decorator_1.Roles)('User'),
    (0, common_1.Delete)('/delete-profile-picture'),
    __param(0, (0, common_1.Session)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "deleteProfilePicture", null);
__decorate([
    (0, common_1.Get)('/getProfileInFo/:userID'),
    __param(0, (0, common_1.Param)('userID')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], UserController.prototype, "getProfile", null);
__decorate([
    (0, common_1.Get)('/getimage/:name'),
    __param(0, (0, common_1.Param)('name')),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], UserController.prototype, "getImages", null);
__decorate([
    (0, common_1.Get)('/allusers'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Object)
], UserController.prototype, "getAll", null);
__decorate([
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, common_1.Get)('/getAc'),
    __param(0, (0, common_1.Session)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Object)
], UserController.prototype, "getUserAc", null);
__decorate([
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, common_1.Get)('/getAc/:userId'),
    __param(0, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Object)
], UserController.prototype, "getUserAcc", null);
__decorate([
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, common_1.Put)('/updateProfile/:email'),
    __param(0, (0, common_1.Param)('email')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, user_dto_1.profileDTO]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "updateProfile", null);
__decorate([
    (0, roles_decorator_1.Roles)('User'),
    (0, common_1.Get)('info-and-transactions/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getUserInfoAndTransaction", null);
exports.UserController = UserController = __decorate([
    (0, common_1.Controller)('/user'),
    __metadata("design:paramtypes", [user_service_1.UserService])
], UserController);
//# sourceMappingURL=user.controller.js.map