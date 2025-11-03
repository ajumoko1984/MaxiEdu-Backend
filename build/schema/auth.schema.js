"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateUserSignup = validateUserSignup;
exports.validateUserLogin = validateUserLogin;
exports.validateForgotPassword = validateForgotPassword;
exports.validateResetPasswordToken = validateResetPasswordToken;
exports.validateProfileUpdate = validateProfileUpdate;
const joi_1 = __importDefault(require("joi"));
const response_handler_1 = __importDefault(require("../utils/response-handler"));
const constants_1 = require("../config/constants");
function validateUserSignup(req, res, next) {
    const schema = joi_1.default.object()
        .keys({
        firstName: joi_1.default.string().lowercase().required(),
        lastName: joi_1.default.string().lowercase().required(),
        email: joi_1.default.string().email().required(),
        role: joi_1.default.string().lowercase().required(),
        password: joi_1.default.string().min(6).max(128).required(),
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
function validateUserLogin(req, res, next) {
    const schema = joi_1.default.object().keys({
        email: joi_1.default.string().email().required(),
        password: joi_1.default.string().required(),
    });
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
function validateForgotPassword(req, res, next) {
    const schema = joi_1.default.object().keys({
        email: joi_1.default.string().email().required(),
    });
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
function validateResetPasswordToken(req, res, next) {
    const schema = joi_1.default.object().keys({
        token: joi_1.default.string().required(),
        password: joi_1.default.string().min(6).max(128).required(),
    });
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
function validateProfileUpdate(req, res, next) {
    const schema = joi_1.default.object()
        .keys({
        firstName: joi_1.default.string().lowercase().optional(),
        lastName: joi_1.default.string().lowercase().optional(),
        phoneNumber: joi_1.default.any().optional(),
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
//# sourceMappingURL=auth.schema.js.map