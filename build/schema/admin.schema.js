"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateAddTransportRoute = validateAddTransportRoute;
exports.validateAddMaterial = validateAddMaterial;
exports.validateCreateSetting = validateCreateSetting;
exports.validateSchoolId = validateSchoolId;
exports.validateIdParam = validateIdParam;
const joi_1 = __importDefault(require("joi"));
const response_handler_1 = __importDefault(require("../utils/response-handler"));
const constants_1 = require("../config/constants");
function validateAddTransportRoute(req, res, next) {
    const schema = joi_1.default.object().keys({
        routeName: joi_1.default.string().required().min(2).max(100),
        routeCode: joi_1.default.string().required(),
        driverName: joi_1.default.string().required().min(2).max(100),
        driverPhone: joi_1.default.string().required().min(10).max(15),
        vehicleRegistration: joi_1.default.string().required(),
        vehicleCapacity: joi_1.default.number().optional().min(1),
        pickupLocations: joi_1.default.array().items(joi_1.default.string()).optional(),
        dropLocations: joi_1.default.array().items(joi_1.default.string()).optional(),
        departureTime: joi_1.default.string().optional(),
        returnTime: joi_1.default.string().optional(),
        costPerTrip: joi_1.default.number().optional().min(0),
        costPerMonth: joi_1.default.number().optional().min(0),
    }).unknown();
    const validation = schema.validate(req.body);
    if (validation.error) {
        const error = validation.error.message || validation.error.details[0].message;
        return response_handler_1.default.sendErrorResponse({
            res,
            code: constants_1.HTTP_CODES.BAD_REQUEST,
            error,
        });
    }
    return next();
}
function validateAddMaterial(req, res, next) {
    const schema = joi_1.default.object().keys({
        title: joi_1.default.string().required().min(2).max(200),
        description: joi_1.default.string().optional(),
        fileUrl: joi_1.default.string().uri().optional(),
        fileType: joi_1.default.string().optional(),
        uploadedBy: joi_1.default.string().optional(),
    }).unknown();
    const validation = schema.validate(req.body);
    if (validation.error) {
        const error = validation.error.message || validation.error.details[0].message;
        return response_handler_1.default.sendErrorResponse({ res, code: constants_1.HTTP_CODES.BAD_REQUEST, error });
    }
    return next();
}
function validateCreateSetting(req, res, next) {
    const schema = joi_1.default.object().keys({
        settingKey: joi_1.default.string().required(),
        value: joi_1.default.string().optional(),
        themeColor: joi_1.default.string().optional(),
    }).unknown();
    const validation = schema.validate(req.body);
    if (validation.error) {
        const error = validation.error.message || validation.error.details[0].message;
        return response_handler_1.default.sendErrorResponse({ res, code: constants_1.HTTP_CODES.BAD_REQUEST, error });
    }
    return next();
}
function validateSchoolId(req, res, next) {
    const schema = joi_1.default.object().keys({
        schoolId: joi_1.default.string().uuid().required(),
    });
    const validation = schema.validate(req.params);
    if (validation.error) {
        const error = validation.error.message || validation.error.details[0].message;
        return response_handler_1.default.sendErrorResponse({ res, code: constants_1.HTTP_CODES.BAD_REQUEST, error });
    }
    return next();
}
function validateIdParam(paramName) {
    return function (req, res, next) {
        const schema = joi_1.default.object().keys({
            [paramName]: joi_1.default.string().uuid().required(),
        });
        const validation = schema.validate(req.params);
        if (validation.error) {
            const error = validation.error.message || validation.error.details[0].message;
            return response_handler_1.default.sendErrorResponse({ res, code: constants_1.HTTP_CODES.BAD_REQUEST, error });
        }
        return next();
    };
}
//# sourceMappingURL=admin.schema.js.map