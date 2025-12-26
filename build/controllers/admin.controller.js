"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const teacher_repository_1 = __importDefault(require("../repository/teacher.repository"));
const student_repository_1 = __importDefault(require("../repository/student.repository"));
const class_repository_1 = __importDefault(require("../repository/class.repository"));
const subject_repository_1 = __importDefault(require("../repository/subject.repository"));
const dorm_repository_1 = __importDefault(require("../repository/dorm.repository"));
const transport_repository_1 = __importDefault(require("../repository/transport.repository"));
const school_repository_1 = __importDefault(require("../repository/school.repository"));
const response_handler_1 = __importDefault(require("../utils/response-handler"));
const constants_1 = require("../config/constants");
const logger_1 = __importDefault(require("../utils/logger"));
const role_enum_1 = require("../enums/role.enum");
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
    async addTeacher(req, res) {
        try {
            const schoolId = req.params.schoolId;
            const { firstName, lastName, email, phoneNumber, employeeId, qualification, subjects } = req.body;
            const exists = await teacher_repository_1.default.findOne({ email });
            if (exists) {
                return response_handler_1.default.sendErrorResponse({
                    res,
                    code: constants_1.HTTP_CODES.CONFLICT,
                    error: "Teacher with this email already exists",
                });
            }
            const teacher = await teacher_repository_1.default.create({
                schoolId,
                firstName,
                lastName,
                email,
                phoneNumber,
                employeeId,
                qualification,
                subjects,
            });
            return response_handler_1.default.sendSuccessResponse({
                res,
                code: constants_1.HTTP_CODES.CREATED,
                message: "Teacher added successfully",
                data: teacher,
            });
        }
        catch (error) {
            logger.error(`Error in addTeacher: ${error.message}`);
            return response_handler_1.default.sendErrorResponse({
                res,
                code: constants_1.HTTP_CODES.INTERNAL_SERVER_ERROR,
                error: "Internal server error",
            });
        }
    }
    async listTeachers(req, res) {
        try {
            const schoolId = req.params.schoolId;
            const teachers = await teacher_repository_1.default.findAllBySchool(schoolId, req.query);
            return response_handler_1.default.sendSuccessResponse({
                res,
                code: constants_1.HTTP_CODES.OK,
                message: "Teachers retrieved successfully",
                data: teachers,
            });
        }
        catch (error) {
            logger.error(`Error in listTeachers: ${error.message}`);
            return response_handler_1.default.sendErrorResponse({
                res,
                code: constants_1.HTTP_CODES.INTERNAL_SERVER_ERROR,
                error: "Internal server error",
            });
        }
    }
    async addStudent(req, res) {
        try {
            const schoolId = req.params.schoolId;
            const { firstName, lastName, email, phoneNumber, studentId, classAssigned, parentName, parentPhone, address, } = req.body;
            const exists = await student_repository_1.default.findOne({ email });
            if (exists) {
                return response_handler_1.default.sendErrorResponse({
                    res,
                    code: constants_1.HTTP_CODES.CONFLICT,
                    error: "Student with this email already exists",
                });
            }
            const student = await student_repository_1.default.create({
                schoolId,
                firstName,
                lastName,
                email,
                phoneNumber,
                studentId,
                classAssigned,
                parentName,
                parentPhone,
                address,
            });
            return response_handler_1.default.sendSuccessResponse({
                res,
                code: constants_1.HTTP_CODES.CREATED,
                message: "Student added successfully",
                data: student,
            });
        }
        catch (error) {
            logger.error(`Error in addStudent: ${error.message}`);
            return response_handler_1.default.sendErrorResponse({
                res,
                code: constants_1.HTTP_CODES.INTERNAL_SERVER_ERROR,
                error: "Internal server error",
            });
        }
    }
    async listStudents(req, res) {
        try {
            const schoolId = req.params.schoolId;
            const students = await student_repository_1.default.findAllBySchool(schoolId, req.query);
            return response_handler_1.default.sendSuccessResponse({
                res,
                code: constants_1.HTTP_CODES.OK,
                message: "Students retrieved successfully",
                data: students,
            });
        }
        catch (error) {
            logger.error(`Error in listStudents: ${error.message}`);
            return response_handler_1.default.sendErrorResponse({
                res,
                code: constants_1.HTTP_CODES.INTERNAL_SERVER_ERROR,
                error: "Internal server error",
            });
        }
    }
    async createClass(req, res) {
        try {
            const schoolId = req.params.schoolId;
            const { name, description, classTeacherId, academicYear } = req.body;
            const exists = await class_repository_1.default.findOne({ name });
            if (exists) {
                return response_handler_1.default.sendErrorResponse({
                    res,
                    code: constants_1.HTTP_CODES.CONFLICT,
                    error: "Class with this name already exists",
                });
            }
            const schoolClass = await class_repository_1.default.create({
                schoolId,
                name,
                description,
                classTeacherId,
                academicYear,
            });
            return response_handler_1.default.sendSuccessResponse({
                res,
                code: constants_1.HTTP_CODES.CREATED,
                message: "Class created successfully",
                data: schoolClass,
            });
        }
        catch (error) {
            logger.error(`Error in createClass: ${error.message}`);
            return response_handler_1.default.sendErrorResponse({
                res,
                code: constants_1.HTTP_CODES.INTERNAL_SERVER_ERROR,
                error: "Internal server error",
            });
        }
    }
    async addSubject(req, res) {
        try {
            const schoolId = req.params.schoolId;
            const { name, code, description, departmentHeadId } = req.body;
            const exists = await subject_repository_1.default.findOne({ name });
            if (exists) {
                return response_handler_1.default.sendErrorResponse({
                    res,
                    code: constants_1.HTTP_CODES.CONFLICT,
                    error: "Subject with this name already exists",
                });
            }
            const subject = await subject_repository_1.default.create({
                schoolId,
                name,
                code,
                description,
                departmentHeadId,
            });
            return response_handler_1.default.sendSuccessResponse({
                res,
                code: constants_1.HTTP_CODES.CREATED,
                message: "Subject added successfully",
                data: subject,
            });
        }
        catch (error) {
            logger.error(`Error in addSubject: ${error.message}`);
            return response_handler_1.default.sendErrorResponse({
                res,
                code: constants_1.HTTP_CODES.INTERNAL_SERVER_ERROR,
                error: "Internal server error",
            });
        }
    }
    async addDorm(req, res) {
        try {
            const schoolId = req.params.schoolId;
            const { name, dormType, capacity, dormMasterId, rules } = req.body;
            const exists = await dorm_repository_1.default.findOne({ name });
            if (exists) {
                return response_handler_1.default.sendErrorResponse({
                    res,
                    code: constants_1.HTTP_CODES.CONFLICT,
                    error: "Dorm with this name already exists",
                });
            }
            const dorm = await dorm_repository_1.default.create({
                schoolId,
                name,
                dormType,
                capacity,
                dormMasterId,
                rules,
            });
            return response_handler_1.default.sendSuccessResponse({
                res,
                code: constants_1.HTTP_CODES.CREATED,
                message: "Dorm added successfully",
                data: dorm,
            });
        }
        catch (error) {
            logger.error(`Error in addDorm: ${error.message}`);
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