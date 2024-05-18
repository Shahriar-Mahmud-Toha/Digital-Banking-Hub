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
exports.profileDTO = exports.RegistrationUserDto = void 0;
const common_1 = require("@nestjs/common");
const class_validator_1 = require("class-validator");
class RegistrationUserDto {
}
exports.RegistrationUserDto = RegistrationUserDto;
__decorate([
    (0, common_1.Optional)(),
    __metadata("design:type", String)
], RegistrationUserDto.prototype, "userId", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], RegistrationUserDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.Matches)(/^(male|female)$/i),
    __metadata("design:type", String)
], RegistrationUserDto.prototype, "gender", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Date)
], RegistrationUserDto.prototype, "dob", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.Matches)(/^\d{8}(?:\d{8})?$/),
    __metadata("design:type", Number)
], RegistrationUserDto.prototype, "nid", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.Matches)(/^01\d{9}$/),
    __metadata("design:type", String)
], RegistrationUserDto.prototype, "phone", void 0);
__decorate([
    (0, class_validator_1.MaxLength)(100),
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], RegistrationUserDto.prototype, "email", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], RegistrationUserDto.prototype, "address", void 0);
__decorate([
    (0, common_1.Optional)(),
    __metadata("design:type", String)
], RegistrationUserDto.prototype, "filename", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], RegistrationUserDto.prototype, "password", void 0);
__decorate([
    (0, common_1.Optional)(),
    __metadata("design:type", String)
], RegistrationUserDto.prototype, "role", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], RegistrationUserDto.prototype, "nomineeName", void 0);
__decorate([
    (0, class_validator_1.Matches)(/^(male|female)$/i),
    __metadata("design:type", String)
], RegistrationUserDto.prototype, "nomineeGender", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Date)
], RegistrationUserDto.prototype, "nomineedob", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.Matches)(/^\d{8}(?:\d{8})?$/),
    __metadata("design:type", Number)
], RegistrationUserDto.prototype, "nomineenNid", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.Matches)(/^01\d{9}$/),
    __metadata("design:type", String)
], RegistrationUserDto.prototype, "nomineephone", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], RegistrationUserDto.prototype, "nomineeAddress", void 0);
__decorate([
    (0, common_1.Optional)(),
    __metadata("design:type", String)
], RegistrationUserDto.prototype, "nomineeFilename", void 0);
__decorate([
    (0, class_validator_1.Matches)(/^(current|saving)$/i),
    __metadata("design:type", String)
], RegistrationUserDto.prototype, "accountType", void 0);
class profileDTO {
}
exports.profileDTO = profileDTO;
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'User ID must not be empty' }),
    __metadata("design:type", String)
], profileDTO.prototype, "userId", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'Name must not be empty' }),
    (0, class_validator_1.MaxLength)(150, { message: 'Name can be at most 150 characters long' }),
    __metadata("design:type", String)
], profileDTO.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'Phone number must not be empty' }),
    (0, class_validator_1.Matches)(/^01\d*$/, { message: 'Phone number must start with "01"' }),
    __metadata("design:type", String)
], profileDTO.prototype, "phone", void 0);
__decorate([
    (0, class_validator_1.MaxLength)(100, { message: 'Email can be at most 100 characters long' }),
    (0, class_validator_1.IsEmail)({}, { message: 'Invalid email format' }),
    __metadata("design:type", String)
], profileDTO.prototype, "email", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'Address must not be empty' }),
    __metadata("design:type", String)
], profileDTO.prototype, "address", void 0);
//# sourceMappingURL=user.dto.js.map