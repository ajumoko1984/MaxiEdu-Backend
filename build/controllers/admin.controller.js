"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const transport_repository_1 = __importDefault(require("../repository/transport.repository"));
const school_repository_1 = __importDefault(require("../repository/school.repository"));
const response_handler_1 = __importDefault(require("../utils/response-handler"));
const constants_1 = require("../config/constants");
const logger_1 = __importDefault(require("../utils/logger"));
const role_enum_1 = require("../enums/role.enum");
const dorm_repository_1 = __importDefault(require("../repository/dorm.repository"));
const subject_repository_1 = __importDefault(require("../repository/subject.repository"));
const class_repository_1 = __importDefault(require("../repository/class.repository"));
const student_repository_1 = __importDefault(require("../repository/student.repository"));
const teacher_repository_1 = __importDefault(require("../repository/teacher.repository"));
const logger = new logger_1.default("School Admin Controller");
class SchoolAdminController {
    async getDashboard(req, res) {
        try {
            const schoolId = req.params.schoolId;
            if (req.user?.accountType !== role_enum_1.ROLE.ADMIN) {
                return response_handler_1.default.sendErrorResponse({
                    res,
                    code: constants_1.HTTP_CODES.FORBIDDEN,
                    error: "Only school admins can access this",
                });
            }
            const school = await school_repository_1.default.findOne({ id: schoolId });
            if (!school) {
                return response_handler_1.default.sendErrorResponse({
                    res,
                    code: constants_1.HTTP_CODES.NOT_FOUND,
                    error: "School not found",
                });
            }
            const teachers = await teacher_repository_1.default.countBySchool(schoolId);
            const students = await student_repository_1.default.countBySchool(schoolId);
            const classes = await class_repository_1.default.countBySchool(schoolId);
            const subjects = await subject_repository_1.default.countBySchool(schoolId);
            const dorms = await dorm_repository_1.default.countBySchool(schoolId);
            const routes = await transport_repository_1.default.countBySchool(schoolId);
            return response_handler_1.default.sendSuccessResponse({
                res,
                code: constants_1.HTTP_CODES.OK,
                message: "Dashboard retrieved successfully",
                data: {
                    school: school.name,
                    totalTeachers: teachers,
                    totalStudents: students,
                    totalClasses: classes,
                    totalSubjects: subjects,
                    totalDorms: dorms,
                    totalTransportRoutes: routes,
                },
            });
        }
        catch (error) {
            logger.error(`Error in getDashboard: ${error.message}`);
            return response_handler_1.default.sendErrorResponse({
                res,
                code: constants_1.HTTP_CODES.INTERNAL_SERVER_ERROR,
                error: "Internal server error",
            });
        }
    }
    async addTransportRoute(req, res) {
        try {
            const schoolId = req.params.schoolId;
            const school = req.school ?? (await school_repository_1.default.findOne({ id: schoolId }));
            if (!school) {
                return response_handler_1.default.sendErrorResponse({
                    res,
                    code: constants_1.HTTP_CODES.NOT_FOUND,
                    error: "School not found",
                });
            }
            const { routeName, startPoint, endPoint, stops, vehicleNumber, driverName, driverPhone, capacity, monthlyFee, } = req.body;
            const exists = await transport_repository_1.default.findOne({ routeName });
            if (exists) {
                return response_handler_1.default.sendErrorResponse({
                    res,
                    code: constants_1.HTTP_CODES.CONFLICT,
                    error: "Route with this name already exists",
                });
            }
            const transport = await transport_repository_1.default.create({
                schoolId,
                routeName,
                startPoint,
                endPoint,
                stops,
                vehicleNumber,
                driverName,
                driverPhone,
                capacity,
                monthlyFee,
            });
            return response_handler_1.default.sendSuccessResponse({
                res,
                code: constants_1.HTTP_CODES.CREATED,
                message: "Transport route added successfully",
                data: transport,
            });
        }
        catch (error) {
            logger.error(`Error in addTransportRoute: ${error.message}`);
            return response_handler_1.default.sendErrorResponse({
                res,
                code: constants_1.HTTP_CODES.INTERNAL_SERVER_ERROR,
                error: "Internal server error",
            });
        }
    }
}
exports.default = new SchoolAdminController();
//# sourceMappingURL=admin.controller.js.map