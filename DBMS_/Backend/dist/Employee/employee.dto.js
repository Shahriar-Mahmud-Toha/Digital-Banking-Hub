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
exports.changePasswordDTO = exports.profileDTO = exports.EmployeeDTO = void 0;
const common_1 = require("@nestjs/common");
const class_validator_1 = require("class-validator");
class EmployeeDTO {
}
exports.EmployeeDTO = EmployeeDTO;
__decorate([
    (0, common_1.Optional)(),
    __metadata("design:type", Number)
], EmployeeDTO.prototype, "userId", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'Name must not be empty' }),
    (0, class_validator_1.MaxLength)(150, { message: 'Name can be at most 150 characters long' }),
    __metadata("design:type", String)
], EmployeeDTO.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'Gender must not be empty' }),
    (0, class_validator_1.Matches)(/^(male|female)$/i, { message: 'Gender must be either "male" or "female"' }),
    __metadata("design:type", String)
], EmployeeDTO.prototype, "gender", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'Date of birth must not be empty' }),
    __metadata("design:type", Date)
], EmployeeDTO.prototype, "dob", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'NID must not be empty' }),
    (0, class_validator_1.Matches)(/^\d{8}(?:\d{8})?$/, { message: 'NID must be 8 digits long' }),
    __metadata("design:type", Number)
], EmployeeDTO.prototype, "nid", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'Phone number must not be empty' }),
    (0, class_validator_1.Matches)(/^01\d*$/, { message: 'Phone number must start with "01"' }),
    __metadata("design:type", String)
], EmployeeDTO.prototype, "phone", void 0);
__decorate([
    (0, class_validator_1.MaxLength)(100, { message: 'Email can be at most 100 characters long' }),
    (0, class_validator_1.IsEmail)({}, { message: 'Invalid email format' }),
    __metadata("design:type", String)
], EmployeeDTO.prototype, "email", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'Address must not be empty' }),
    __metadata("design:type", String)
], EmployeeDTO.prototype, "address", void 0);
__decorate([
    (0, common_1.Optional)(),
    __metadata("design:type", Boolean)
], EmployeeDTO.prototype, "isActive", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'Password must not be empty' }),
    (0, class_validator_1.Matches)(/[A-Za-z\d!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]{8,}$/, { message: 'Password must be at least 8 characters long and contain at least one special character One Upperletter & One Lowerletter' }),
    __metadata("design:type", String)
], EmployeeDTO.prototype, "password", void 0);
__decorate([
    (0, common_1.Optional)(),
    __metadata("design:type", String)
], EmployeeDTO.prototype, "role", void 0);
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
    (0, class_validator_1.IsNotEmpty)({ message: 'Gender must not be empty' }),
    (0, class_validator_1.Matches)(/^(male|female)$/i, { message: 'Gender must be either "male" or "female"' }),
    __metadata("design:type", String)
], profileDTO.prototype, "gender", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'Date of birth must not be empty' }),
    __metadata("design:type", String)
], profileDTO.prototype, "dob", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'NID must not be empty' }),
    (0, class_validator_1.Matches)(/^\d{8}(?:\d{8})?$/, { message: 'NID must be 8 digits long' }),
    __metadata("design:type", Number)
], profileDTO.prototype, "nid", void 0);
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
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'Role must not be empty' }),
    __metadata("design:type", String)
], profileDTO.prototype, "role", void 0);
class changePasswordDTO {
}
exports.changePasswordDTO = changePasswordDTO;
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'Current password must not be empty' }),
    __metadata("design:type", String)
], changePasswordDTO.prototype, "currentPassword", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'New password must not be empty' }),
    (0, class_validator_1.Matches)(/[A-Za-z\d!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]{8,}$/, { message: 'New password must be at least 8 characters long and contain at least one special character One Upperletter & One Lowerletter' }),
    __metadata("design:type", String)
], changePasswordDTO.prototype, "newPassword", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'Confirm password must not be empty' }),
    (0, class_validator_1.Matches)(/[A-Za-z\d!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]{8,}$/, { message: 'Confirm password must be at least 8 characters long and contain at least one special character One Upperletter & One Lowerletter' }),
    __metadata("design:type", String)
], changePasswordDTO.prototype, "confirmPassword", void 0);
//# sourceMappingURL=employee.dto.js.map