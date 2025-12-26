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
exports.Transport = void 0;
const class_validator_1 = require("class-validator");
const typeorm_1 = require("typeorm");
const school_entity_1 = require("./school.entity");
let Transport = class Transport {
};
exports.Transport = Transport;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)("uuid"),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], Transport.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "uuid" }),
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], Transport.prototype, "schoolId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => school_entity_1.School),
    (0, typeorm_1.JoinColumn)({ name: "schoolId" }),
    __metadata("design:type", school_entity_1.School)
], Transport.prototype, "school", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", unique: true }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], Transport.prototype, "routeName", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", nullable: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Transport.prototype, "startPoint", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", nullable: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Transport.prototype, "endPoint", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "text", nullable: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Transport.prototype, "stops", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", nullable: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Transport.prototype, "vehicleNumber", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", nullable: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Transport.prototype, "driverName", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", nullable: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Transport.prototype, "driverPhone", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "int", default: 0 }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], Transport.prototype, "capacity", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "decimal", nullable: true }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], Transport.prototype, "monthlyFee", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "boolean", default: true }),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], Transport.prototype, "isActive", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "boolean", default: false }),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], Transport.prototype, "isDeleted", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" }),
    __metadata("design:type", Date)
], Transport.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" }),
    __metadata("design:type", Date)
], Transport.prototype, "updatedAt", void 0);
exports.Transport = Transport = __decorate([
    (0, typeorm_1.Entity)("transport_routes")
], Transport);
//# sourceMappingURL=transport.entity.js.map