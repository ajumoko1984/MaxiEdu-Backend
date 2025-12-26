"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateCreateSchool = validateCreateSchool;
exports.validateUpdateSchool = validateUpdateSchool;
const joi_1 = __importDefault(require("joi"));
const response_handler_1 = __importDefault(require("../utils/response-handler"));
const constants_1 = require("../config/constants");
function validateCreateSchool(req, res, next) {
    const schema = joi_1.default.object()
        .keys({
        name: joi_1.default.string().min(2).max(255).required(),
        address: joi_1.default.string().max(500).optional(),
        phoneNumber: joi_1.default.string()
            .regex(/^\+?[\d\s\-()]{10,15}$/)
            .optional(),
        email: joi_1.default.string().email().optional(),
        website: joi_1.default.string().uri().optional(),
        principalName: joi_1.default.string().max(255).optional(),
        description: joi_1.default.string().max(2000).optional(),
        registrationNumber: joi_1.default.string().max(100).optional(),
        state: joi_1.default.string().max(100).optional(),
        city: joi_1.default.string().max(100).optional(),
    })
        .unknown();
    const validation = schema.validate(req.body);
    if (validation.error) {
        const error = validation.error.message
            ? validation.error.message
            : validation.error.details[0].message;
        return response_handler_1.default.sendErrorResponse({
            res,
            code: constants_1.HTTP_CODES.BAD_REQUEST,
            error,
        });
    }
    return next();
}
function validateUpdateSchool(req, res, next) {
    const schema = joi_1.default.object()
        .keys({
        name: joi_1.default.string().min(2).max(255).optional(),
        address: joi_1.default.string().max(500).optional(),
        phoneNumber: joi_1.default.string()
            .regex(/^\+?[\d\s\-()]{10,15}$/)
            .optional(),
        email: joi_1.default.string().email().optional(),
        website: joi_1.default.string().uri().optional(),
        principalName: joi_1.default.string().max(255).optional(),
        description: joi_1.default.string().max(2000).optional(),
        registrationNumber: joi_1.default.string().max(100).optional(),
        state: joi_1.default.string().max(100).optional(),
        city: joi_1.default.string().max(100).optional(),
        isActive: joi_1.default.boolean().optional(),
        isDisabled: joi_1.default.boolean().optional(),
    })
        .unknown();
    const validation = schema.validate(req.body);
    if (validation.error) {
        const error = validation.error.message
            ? validation.error.message
            : validation.error.details[0].message;
        return response_handler_1.default.sendErrorResponse({
            res,
            code: constants_1.HTTP_CODES.BAD_REQUEST,
            error,
        });
    }
    return next();
}
//# sourceMappingURL=school.schema.js.map