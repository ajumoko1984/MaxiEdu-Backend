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
import parentRepository from "../repository/parent.repository";
import sessionRepository from "../repository/session.repository";
import examRepository from "../repository/exam.repository";
import attendanceRepository from "../repository/attendance.repository";
import materialRepository from "../repository/material.repository";
import scoreRepository from "../repository/score.repository";
import gradeRepository from "../repository/grade.repository";
import settingRepository from "../repository/setting.repository";
import alumniRepository from "../repository/alumni.repository";

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



  // Add transport route
  async addTransportRoute(req: ExpressRequest, res: Response) {
    try {
      const schoolId = req.params.schoolId;
      const school = (req as any).school ?? (await schoolRepository.findOne({ id: schoolId }));

      if (!school) {
        return ResponseHandler.sendErrorResponse({
          res,
          code: HTTP_CODES.NOT_FOUND,
          error: "School not found",
        });
      }
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
