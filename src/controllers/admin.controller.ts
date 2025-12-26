import { Response } from "express";
import transportRepository from "../repository/transport.repository";
import schoolRepository from "../repository/school.repository";
import ResponseHandler from "../utils/response-handler";
import { HTTP_CODES } from "../config/constants";
import Logger from "../utils/logger";
import { ExpressRequest } from "../app";
import { ROLE } from "../enums/role.enum";
import dormRepository from "../repository/dorm.repository";
import subjectRepository from "../repository/subject.repository";
import classRepository from "../repository/class.repository";
import studentRepository from "../repository/student.repository";
import teacherRepository from "../repository/teacher.repository";

const logger = new Logger("School Admin Controller");

class SchoolAdminController {
  // Get school admin dashboard
  async getDashboard(req: ExpressRequest, res: Response) {
    try {
      const schoolId = req.params.schoolId;

      // Verify user has access to this school
      if (req.user?.accountType !== ROLE.ADMIN) {
        return ResponseHandler.sendErrorResponse({
          res,
          code: HTTP_CODES.FORBIDDEN,
          error: "Only school admins can access this",
        });
      }

      const school = await schoolRepository.findOne({ id: schoolId });
      if (!school) {
        return ResponseHandler.sendErrorResponse({
          res,
          code: HTTP_CODES.NOT_FOUND,
          error: "School not found",
        });
      }

      const teachers = await teacherRepository.countBySchool(schoolId);
      const students = await studentRepository.countBySchool(schoolId);
      const classes = await classRepository.countBySchool(schoolId);
      const subjects = await subjectRepository.countBySchool(schoolId);
      const dorms = await dormRepository.countBySchool(schoolId);
      const routes = await transportRepository.countBySchool(schoolId);

      return ResponseHandler.sendSuccessResponse({
        res,
        code: HTTP_CODES.OK,
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
    } catch (error: any) {
      logger.error(`Error in getDashboard: ${error.message}`);
      return ResponseHandler.sendErrorResponse({
        res,
        code: HTTP_CODES.INTERNAL_SERVER_ERROR,
        error: "Internal server error",
      });
    }
  }

  // Add teacher
  async addTeacher(req: ExpressRequest, res: Response) {
    try {
      const schoolId = req.params.schoolId;
      const { firstName, lastName, email, phoneNumber, employeeId, qualification, subjects } = req.body;

      const exists = await teacherRepository.findOne({ email });
      if (exists) {
        return ResponseHandler.sendErrorResponse({
          res,
          code: HTTP_CODES.CONFLICT,
          error: "Teacher with this email already exists",
        });
      }

      const teacher = await teacherRepository.create({
        schoolId,
        firstName,
        lastName,
        email,
        phoneNumber,
        employeeId,
        qualification,
        subjects,
      });

      return ResponseHandler.sendSuccessResponse({
        res,
        code: HTTP_CODES.CREATED,
        message: "Teacher added successfully",
        data: teacher,
      });
    } catch (error: any) {
      logger.error(`Error in addTeacher: ${error.message}`);
      return ResponseHandler.sendErrorResponse({
        res,
        code: HTTP_CODES.INTERNAL_SERVER_ERROR,
        error: "Internal server error",
      });
    }
  }

  // List teachers
  async listTeachers(req: ExpressRequest, res: Response) {
    try {
      const schoolId = req.params.schoolId;
      const teachers = await teacherRepository.findAllBySchool(schoolId, req.query);

      return ResponseHandler.sendSuccessResponse({
        res,
        code: HTTP_CODES.OK,
        message: "Teachers retrieved successfully",
        data: teachers,
      });
    } catch (error: any) {
      logger.error(`Error in listTeachers: ${error.message}`);
      return ResponseHandler.sendErrorResponse({
        res,
        code: HTTP_CODES.INTERNAL_SERVER_ERROR,
        error: "Internal server error",
      });
    }
  }

  // Add student
  async addStudent(req: ExpressRequest, res: Response) {
    try {
      const schoolId = req.params.schoolId;
      const {
        firstName,
        lastName,
        email,
        phoneNumber,
        studentId,
        classAssigned,
        parentName,
        parentPhone,
        address,
      } = req.body;

      const exists = await studentRepository.findOne({ email });
      if (exists) {
        return ResponseHandler.sendErrorResponse({
          res,
          code: HTTP_CODES.CONFLICT,
          error: "Student with this email already exists",
        });
      }

      const student = await studentRepository.create({
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

      return ResponseHandler.sendSuccessResponse({
        res,
        code: HTTP_CODES.CREATED,
        message: "Student added successfully",
        data: student,
      });
    } catch (error: any) {
      logger.error(`Error in addStudent: ${error.message}`);
      return ResponseHandler.sendErrorResponse({
        res,
        code: HTTP_CODES.INTERNAL_SERVER_ERROR,
        error: "Internal server error",
      });
    }
  }

  // List students
  async listStudents(req: ExpressRequest, res: Response) {
    try {
      const schoolId = req.params.schoolId;
      const students = await studentRepository.findAllBySchool(schoolId, req.query);

      return ResponseHandler.sendSuccessResponse({
        res,
        code: HTTP_CODES.OK,
        message: "Students retrieved successfully",
        data: students,
      });
    } catch (error: any) {
      logger.error(`Error in listStudents: ${error.message}`);
      return ResponseHandler.sendErrorResponse({
        res,
        code: HTTP_CODES.INTERNAL_SERVER_ERROR,
        error: "Internal server error",
      });
    }
  }

  // Create class
  async createClass(req: ExpressRequest, res: Response) {
    try {
      const schoolId = req.params.schoolId;
      const { name, description, classTeacherId, academicYear } = req.body;

      const exists = await classRepository.findOne({ name });
      if (exists) {
        return ResponseHandler.sendErrorResponse({
          res,
          code: HTTP_CODES.CONFLICT,
          error: "Class with this name already exists",
        });
      }

      const schoolClass = await classRepository.create({
        schoolId,
        name,
        description,
        classTeacherId,
        academicYear,
      });

      return ResponseHandler.sendSuccessResponse({
        res,
        code: HTTP_CODES.CREATED,
        message: "Class created successfully",
        data: schoolClass,
      });
    } catch (error: any) {
      logger.error(`Error in createClass: ${error.message}`);
      return ResponseHandler.sendErrorResponse({
        res,
        code: HTTP_CODES.INTERNAL_SERVER_ERROR,
        error: "Internal server error",
      });
    }
  }

  // Add subject
  async addSubject(req: ExpressRequest, res: Response) {
    try {
      const schoolId = req.params.schoolId;
      const { name, code, description, departmentHeadId } = req.body;

      const exists = await subjectRepository.findOne({ name });
      if (exists) {
        return ResponseHandler.sendErrorResponse({
          res,
          code: HTTP_CODES.CONFLICT,
          error: "Subject with this name already exists",
        });
      }

      const subject = await subjectRepository.create({
        schoolId,
        name,
        code,
        description,
        departmentHeadId,
      });

      return ResponseHandler.sendSuccessResponse({
        res,
        code: HTTP_CODES.CREATED,
        message: "Subject added successfully",
        data: subject,
      });
    } catch (error: any) {
      logger.error(`Error in addSubject: ${error.message}`);
      return ResponseHandler.sendErrorResponse({
        res,
        code: HTTP_CODES.INTERNAL_SERVER_ERROR,
        error: "Internal server error",
      });
    }
  }

  // Add dorm
  async addDorm(req: ExpressRequest, res: Response) {
    try {
      const schoolId = req.params.schoolId;
      const { name, dormType, capacity, dormMasterId, rules } = req.body;

      const exists = await dormRepository.findOne({ name });
      if (exists) {
        return ResponseHandler.sendErrorResponse({
          res,
          code: HTTP_CODES.CONFLICT,
          error: "Dorm with this name already exists",
        });
      }

      const dorm = await dormRepository.create({
        schoolId,
        name,
        dormType,
        capacity,
        dormMasterId,
        rules,
      });

      return ResponseHandler.sendSuccessResponse({
        res,
        code: HTTP_CODES.CREATED,
        message: "Dorm added successfully",
        data: dorm,
      });
    } catch (error: any) {
      logger.error(`Error in addDorm: ${error.message}`);
      return ResponseHandler.sendErrorResponse({
        res,
        code: HTTP_CODES.INTERNAL_SERVER_ERROR,
        error: "Internal server error",
      });
    }
  }

  // Add transport route
  async addTransportRoute(req: ExpressRequest, res: Response) {
    try {
      const schoolId = req.params.schoolId;
      const {
        routeName,
        startPoint,
        endPoint,
        stops,
        vehicleNumber,
        driverName,
        driverPhone,
        capacity,
        monthlyFee,
      } = req.body;

      const exists = await transportRepository.findOne({ routeName });
      if (exists) {
        return ResponseHandler.sendErrorResponse({
          res,
          code: HTTP_CODES.CONFLICT,
          error: "Route with this name already exists",
        });
      }

      const transport = await transportRepository.create({
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

      return ResponseHandler.sendSuccessResponse({
        res,
        code: HTTP_CODES.CREATED,
        message: "Transport route added successfully",
        data: transport,
      });
    } catch (error: any) {
      logger.error(`Error in addTransportRoute: ${error.message}`);
      return ResponseHandler.sendErrorResponse({
        res,
        code: HTTP_CODES.INTERNAL_SERVER_ERROR,
        error: "Internal server error",
      });
    }
  }
}

export default new SchoolAdminController();
