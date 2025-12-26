"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateAddTeacher = validateAddTeacher;
exports.validateAddStudent = validateAddStudent;
exports.validateCreateClass = validateCreateClass;
exports.validateAddSubject = validateAddSubject;
exports.validateAddDorm = validateAddDorm;
exports.validateAddTransportRoute = validateAddTransportRoute;
const joi_1 = __importDefault(require("joi"));
const response_handler_1 = __importDefault(require("../utils/response-handler"));
const constants_1 = require("../config/constants");
function validateAddTeacher(req, res, next) {
    const schema = joi_1.default.object().keys({
        firstName: joi_1.default.string().required().min(2).max(100),
        lastName: joi_1.default.string().required().min(2).max(100),
        email: joi_1.default.string().email().required(),
        phone: joi_1.default.string().required().min(10).max(15),
        staffId: joi_1.default.string().required(),
        subject: joi_1.default.string().required(),
        qualifications: joi_1.default.string().optional(),
        dateOfBirth: joi_1.default.date().optional(),
        gender: joi_1.default.string().valid("Male", "Female", "Other").optional(),
        address: joi_1.default.string().optional(),
        employmentDate: joi_1.default.date().required(),
        contractType: joi_1.default.string().valid("Permanent", "Contract", "Temporary").optional(),
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
function validateAddStudent(req, res, next) {
    const schema = joi_1.default.object().keys({
        firstName: joi_1.default.string().required().min(2).max(100),
        lastName: joi_1.default.string().required().min(2).max(100),
        email: joi_1.default.string().email().optional(),
        phone: joi_1.default.string().optional().min(10).max(15),
        admissionNumber: joi_1.default.string().required(),
        classId: joi_1.default.string().required(),
        dateOfBirth: joi_1.default.date().optional(),
        gender: joi_1.default.string().valid("Male", "Female", "Other").optional(),
        fatherName: joi_1.default.string().optional(),
        fatherPhone: joi_1.default.string().optional().min(10).max(15),
        motherName: joi_1.default.string().optional(),
        motherPhone: joi_1.default.string().optional().min(10).max(15),
        address: joi_1.default.string().optional(),
        admissionDate: joi_1.default.date().required(),
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
function validateCreateClass(req, res, next) {
    const schema = joi_1.default.object().keys({
        className: joi_1.default.string().required().min(2).max(100),
        classCode: joi_1.default.string().required(),
        form: joi_1.default.string().required(),
        stream: joi_1.default.string().optional(),
        classTeacherId: joi_1.default.string().required(),
        capacity: joi_1.default.number().integer().min(1).optional(),
        roomNumber: joi_1.default.string().optional(),
        academicYear: joi_1.default.string().required(),
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
function validateAddSubject(req, res, next) {
    const schema = joi_1.default.object().keys({
        subjectName: joi_1.default.string().required().min(2).max(100),
        subjectCode: joi_1.default.string().required(),
        form: joi_1.default.string().required(),
        teacherId: joi_1.default.string().optional(),
        credits: joi_1.default.number().optional().min(0).max(10),
        description: joi_1.default.string().optional(),
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
function validateAddDorm(req, res, next) {
    const schema = joi_1.default.object().keys({
        dormName: joi_1.default.string().required().min(2).max(100),
        dormCode: joi_1.default.string().required(),
        capacity: joi_1.default.number().integer().required().min(1),
        gender: joi_1.default.string().valid("Boys", "Girls", "Mixed").required(),
        wardensName: joi_1.default.string().required(),
        wardensPhone: joi_1.default.string().required().min(10).max(15),
        groundFloor: joi_1.default.number().integer().optional().min(0),
        firstFloor: joi_1.default.number().integer().optional().min(0),
        secondFloor: joi_1.default.number().integer().optional().min(0),
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
function validateAddTransportRoute(req, res, next) {
    const schema = joi_1.default.object().keys({
        routeName: joi_1.default.string().required().min(2).max(100),
        routeCode: joi_1.default.string().required(),
        driverName: joi_1.default.string().required().min(2).max(100),
        driverPhone: joi_1.default.string().required().min(10).max(15),
        vehicleRegistration: joi_1.default.string().required(),
        vehicleCapacity: joi_1.default.number().integer().required().min(1),
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
//# sourceMappingURL=admin.schema.js.map