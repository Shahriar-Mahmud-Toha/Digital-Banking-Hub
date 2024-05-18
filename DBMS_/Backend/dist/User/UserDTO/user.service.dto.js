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
exports.serviceDTO = void 0;
const common_1 = require("@nestjs/common");
const class_validator_1 = require("class-validator");
class serviceDTO {
}
exports.serviceDTO = serviceDTO;
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.Matches)(/^\d{8}(?:\d{8})?$/),
    (0, common_1.Optional)(),
    __metadata("design:type", Number)
], serviceDTO.prototype, "accountNumber", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], serviceDTO.prototype, "name", void 0);
__decorate([
    (0, common_1.Optional)(),
    __metadata("design:type", String)
], serviceDTO.prototype, "filename", void 0);
__decorate([
    (0, common_1.Optional)(),
    __metadata("design:type", Date)
], serviceDTO.prototype, "applicationTime", void 0);
//# sourceMappingURL=user.service.dto.js.map