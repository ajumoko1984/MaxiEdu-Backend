"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const school_repository_1 = __importDefault(require("../repository/school.repository"));
const response_handler_1 = __importDefault(require("../utils/response-handler"));
const constants_1 = require("../config/constants");
const logger_1 = __importDefault(require("../utils/logger"));
const logger = new logger_1.default("School Controller");
class SchoolController {
    async createSchool(req, res) {
        try {
            const { name, address, phoneNumber, email, website, principalName, description, registrationNumber, state, city, } = req.body;
            const existingSchool = await school_repository_1.default.findOne({ name });
            if (existingSchool) {
                return response_handler_1.default.sendErrorResponse({
                    res,
                    code: constants_1.HTTP_CODES.CONFLICT,
                    error: "School with this name already exists",
                });
            }
            const school = await school_repository_1.default.create({
                name,
                address,
                phoneNumber,
                email,
                website,
                principalName,
                description,
                registrationNumber,
                state,
                city,
            });
            return response_handler_1.default.sendSuccessResponse({
                res,
                code: constants_1.HTTP_CODES.CREATED,
                message: "School created successfully",
                data: school,
            });
        }
        catch (error) {
            logger.error(`Error in createSchool: ${error.message}`);
            return response_handler_1.default.sendErrorResponse({
                res,
                code: constants_1.HTTP_CODES.INTERNAL_SERVER_ERROR,
                error: "Internal server error",
            });
        }
    }
    async getAllSchools(req, res) {
        try {
            const schools = await school_repository_1.default.findAll(req.query);
            return response_handler_1.default.sendSuccessResponse({
                res,
                code: constants_1.HTTP_CODES.OK,
                message: "Schools retrieved successfully",
                data: schools,
            });
        }
        catch (error) {
            logger.error(`Error in getAllSchools: ${error.message}`);
            return response_handler_1.default.sendErrorResponse({
                res,
                code: constants_1.HTTP_CODES.INTERNAL_SERVER_ERROR,
                error: "Internal server error",
            });
        }
    }
    async getSchoolById(req, res) {
        try {
            const { id } = req.params;
            const school = await school_repository_1.default.findOne({ id });
            if (!school) {
                return response_handler_1.default.sendErrorResponse({
                    res,
                    code: constants_1.HTTP_CODES.NOT_FOUND,
                    error: "School not found",
                });
            }
            return response_handler_1.default.sendSuccessResponse({
                res,
                code: constants_1.HTTP_CODES.OK,
                message: "School retrieved successfully",
                data: school,
            });
        }
        catch (error) {
            logger.error(`Error in getSchoolById: ${error.message}`);
            return response_handler_1.default.sendErrorResponse({
                res,
                code: constants_1.HTTP_CODES.INTERNAL_SERVER_ERROR,
                error: "Internal server error",
            });
        }
    }
    async updateSchool(req, res) {
        try {
            const { id } = req.params;
            const allowed = {};
            const allowedFields = [
                "name",
                "address",
                "phoneNumber",
                "email",
                "website",
                "principalName",
                "description",
                "registrationNumber",
                "state",
                "city",
                "isActive",
                "isDisabled",
            ];
            Object.keys(req.body).forEach((key) => {
                if (allowedFields.includes(key)) {
                    allowed[key] = req.body[key];
                }
            });
            const school = await school_repository_1.default.atomicUpdate({ id }, allowed);
            if (!school) {
                return response_handler_1.default.sendErrorResponse({
                    res,
                    code: constants_1.HTTP_CODES.NOT_FOUND,
                    error: "School not found",
                });
            }
            return response_handler_1.default.sendSuccessResponse({
                res,
                code: constants_1.HTTP_CODES.OK,
                message: "School updated successfully",
                data: school,
            });
        }
        catch (error) {
            logger.error(`Error in updateSchool: ${error.message}`);
            return response_handler_1.default.sendErrorResponse({
                res,
                code: constants_1.HTTP_CODES.INTERNAL_SERVER_ERROR,
                error: "Internal server error",
            });
        }
    }
    async deleteSchool(req, res) {
        try {
            const { id } = req.params;
            const success = await school_repository_1.default.deleteOne({ id });
            if (!success) {
                return response_handler_1.default.sendErrorResponse({
                    res,
                    code: constants_1.HTTP_CODES.NOT_FOUND,
                    error: "School not found",
                });
            }
            return response_handler_1.default.sendSuccessResponse({
                res,
                code: constants_1.HTTP_CODES.OK,
                message: "School deleted successfully",
            });
        }
        catch (error) {
            logger.error(`Error in deleteSchool: ${error.message}`);
            return response_handler_1.default.sendErrorResponse({
                res,
                code: constants_1.HTTP_CODES.INTERNAL_SERVER_ERROR,
                error: "Internal server error",
            });
        }
    }
    async getPlatformOverview(req, res) {
        try {
            const overview = await school_repository_1.default.getSchoolsOverview();
            return response_handler_1.default.sendSuccessResponse({
                res,
                code: constants_1.HTTP_CODES.OK,
                message: "Platform overview retrieved successfully",
                data: overview,
            });
        }
        catch (error) {
            logger.error(`Error in getPlatformOverview: ${error.message}`);
            return response_handler_1.default.sendErrorResponse({
                res,
                code: constants_1.HTTP_CODES.INTERNAL_SERVER_ERROR,
                error: "Internal server error",
            });
        }
    }
}
exports.default = new SchoolController();
//# sourceMappingURL=school.controller.js.map