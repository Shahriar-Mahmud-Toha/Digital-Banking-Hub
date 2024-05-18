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
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const auth_service_1 = require("./auth.service");
const login_dto_1 = require("../DTO/login.dto");
const bcrypt = require("bcrypt");
const multer_1 = require("multer");
const platform_express_1 = require("@nestjs/platform-express");
const user_dto_1 = require("../User/UserDTO/user.dto");
let AuthController = class AuthController {
    constructor(authService) {
        this.authService = authService;
    }
    async createAccount(myobj, myFiles) {
        const salt = await bcrypt.genSalt();
        const hashedpassword = await bcrypt.hash(myobj.password, salt);
        myobj.password = hashedpassword;
        if (myFiles.length !== 2) {
            throw new Error('Please upload exactly two files');
        }
        myobj.filename = myFiles[0].filename;
        myobj.nomineeFilename = myFiles[1].filename;
        return this.authService.signUp(myobj);
    }
    signIn(logindata, req) {
        return this.authService.signIn(logindata, req.session);
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, common_1.Post)('/Registration'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FilesInterceptor)('myFiles', 2, {
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
    __param(1, (0, common_1.UploadedFiles)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_dto_1.RegistrationUserDto, Array]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "createAccount", null);
__decorate([
    (0, common_1.Post)('login'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [login_dto_1.loginDTO, Object]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "signIn", null);
exports.AuthController = AuthController = __decorate([
    (0, common_1.Controller)('auth'),
    __metadata("design:paramtypes", [auth_service_1.AuthService])
], AuthController);
//# sourceMappingURL=auth.controller.js.map