import { Response } from "express";
import ResponseHandler from "../utils/response-handler";
import { HTTP_CODES } from "../config/constants";
import Logger from "../utils/logger";
import { ExpressRequest } from "../app";
import attendanceRepository from "../repository/attendance.repository";
import schoolRepository from "../repository/school.repository";
import studentRepository from "../repository/student.repository";
import teacherRepository from "../repository/teacher.repository";
import usersRepository from "../repository/users.repository";
import { ROLE } from "../enums/role.enum";

const logger = new Logger("Attendance Controller");

class AttendanceController {
    // Mark attendance
  async markAttendance(req: ExpressRequest, res: Response) {
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
      let { userId, userType, date, status, checkInTime, checkOutTime, method, markedBy, remarks, confidenceScore } = req.body;

      userType = String(userType);

      // Validate user existence based on role and ensure active/not disabled
      if ([ROLE.STUDENT].includes(userType as ROLE)) {
        const student = await studentRepository.findOne({ id: userId, schoolId, isActive: true, isDisabled: false, isDeleted: false });
        if (!student) return ResponseHandler.sendErrorResponse({ res, code: HTTP_CODES.BAD_REQUEST, error: "Invalid student id, student does not belong to school, or student is inactive/disabled" });
      } else if ([ROLE.TEACHER].includes(userType as ROLE)) {
        const teacher = await teacherRepository.findOne({ id: userId, schoolId, isActive: true, isDisabled: false, isDeleted: false });
        if (!teacher) return ResponseHandler.sendErrorResponse({ res, code: HTTP_CODES.BAD_REQUEST, error: "Invalid teacher id, teacher does not belong to school, or teacher is inactive/disabled" });
      } else if ([ROLE.ADMIN, ROLE.OTHER_STAFF, ROLE.HR].includes(userType as ROLE)) {
        const user = await usersRepository.findOne({ id: userId, accountType: userType, isActive: true, isDisabled: false, isDeleted: false });
        if (!user) return ResponseHandler.sendErrorResponse({ res, code: HTTP_CODES.BAD_REQUEST, error: "Invalid staff/admin id, account type mismatch, or user is inactive/disabled" });
      } else {
        return ResponseHandler.sendErrorResponse({ res, code: HTTP_CODES.BAD_REQUEST, error: "Unsupported userType" });
      }

      // Validate markedBy if present
      if (markedBy) {
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
        if (!uuidRegex.test(String(markedBy))) {
          return ResponseHandler.sendErrorResponse({ res, code: HTTP_CODES.BAD_REQUEST, error: "Invalid markedBy id format" });
        }
        const marker = await usersRepository.findOne({ id: markedBy });
        if (!marker) {
          return ResponseHandler.sendErrorResponse({ res, code: HTTP_CODES.BAD_REQUEST, error: "markedBy user not found" });
        }
      }

      const attendance = await attendanceRepository.create({ userId, userType, date, status, checkInTime, checkOutTime, method, markedBy, remarks, confidenceScore });
      return ResponseHandler.sendSuccessResponse({ res, code: HTTP_CODES.CREATED, message: "Attendance marked", data: attendance });
    } catch (error: any) {
      logger.error(`Error in markAttendance: ${error.message}`);
      return ResponseHandler.sendErrorResponse({ res, code: HTTP_CODES.INTERNAL_SERVER_ERROR, error: "Internal server error" });
    }
  }

  // Get attendance by attendance id
  async getAttendance(req: ExpressRequest, res: Response) {
    try {
      const attendanceId = req.params.id;
      const record = await attendanceRepository.findOne({ id: attendanceId });
      if (!record) return ResponseHandler.sendErrorResponse({ res, code: HTTP_CODES.NOT_FOUND, error: "Attendance not found" });
      return ResponseHandler.sendSuccessResponse({ res, code: HTTP_CODES.OK, message: "Attendance retrieved", data: record });
    } catch (error: any) {
      logger.error(`Error in getAttendance: ${error.message}`);
      return ResponseHandler.sendErrorResponse({ res, code: HTTP_CODES.INTERNAL_SERVER_ERROR, error: "Internal server error" });
    }
  }

  // List attendance by date, userId or userType. Supports grouping by userType when query.groupBy=userType
  async listAttendance(req: ExpressRequest, res: Response) {
    try {
      const schoolId = req.params.schoolId;
      const school = (req as any).school ?? (await schoolRepository.findOne({ id: schoolId }));
      if (!school) {
        return ResponseHandler.sendErrorResponse({ res, code: HTTP_CODES.NOT_FOUND, error: "School not found" });
      }

      const { date, userId, userType, groupBy } = req.query as any;

      // If userId is provided, validate its format and ensure the user exists (student -> teacher -> staff)
      if (userId) {
        // UUID v1-5 check
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
        if (!uuidRegex.test(String(userId))) {
          return ResponseHandler.sendErrorResponse({ res, code: HTTP_CODES.BAD_REQUEST, error: "Invalid userId format" });
        }

        // check student
        const student = await studentRepository.findOne({ id: userId, schoolId });
        if (student) {
          const records = await attendanceRepository.findByUser(userId);
          if (!records || records.length === 0) return ResponseHandler.sendErrorResponse({ res, code: HTTP_CODES.NOT_FOUND, error: "No attendance record for that user" });
          return ResponseHandler.sendSuccessResponse({ res, code: HTTP_CODES.OK, message: "Attendance retrieved", data: records });
        }

        // check teacher
        const teacher = await teacherRepository.findOne({ id: userId, schoolId });
        if (teacher) {
          const records = await attendanceRepository.findByUser(userId);
          if (!records || records.length === 0) return ResponseHandler.sendErrorResponse({ res, code: HTTP_CODES.NOT_FOUND, error: "No attendance record for that user" });
          return ResponseHandler.sendSuccessResponse({ res, code: HTTP_CODES.OK, message: "Attendance retrieved", data: records });
        }

        // check staff/user
        const user = await usersRepository.findOne({ id: userId });
        if (user) {
          const records = await attendanceRepository.findByUser(userId);
          if (!records || records.length === 0) return ResponseHandler.sendErrorResponse({ res, code: HTTP_CODES.NOT_FOUND, error: "No attendance record for that user" });
          return ResponseHandler.sendSuccessResponse({ res, code: HTTP_CODES.OK, message: "Attendance retrieved", data: records });
        }

        return ResponseHandler.sendErrorResponse({ res, code: HTTP_CODES.NOT_FOUND, error: "User not found" });
      }

      // Validate userType when provided for other queries
      if (userType && !Object.values(ROLE).includes(String(userType) as ROLE)) {
        return ResponseHandler.sendErrorResponse({ res, code: HTTP_CODES.BAD_REQUEST, error: "Invalid userType" });
      }

      // Date + userType: scope to school's students/teachers when applicable
      if (date && userType) {
        if (String(userType) === ROLE.STUDENT) {
          const studentIds = await studentRepository.findIdsBySchool(schoolId);
          const records = await attendanceRepository.findByUserIdsAndDate(studentIds, date);
          if (!records || records.length === 0) return ResponseHandler.sendErrorResponse({ res, code: HTTP_CODES.NOT_FOUND, error: "No attendance record for that day" });
          return ResponseHandler.sendSuccessResponse({ res, code: HTTP_CODES.OK, message: "Attendance retrieved", data: records });
        }
        if (String(userType) === ROLE.TEACHER) {
          const teacherIds = await teacherRepository.findIdsBySchool(schoolId);
          const records = await attendanceRepository.findByUserIdsAndDate(teacherIds, date);
          if (!records || records.length === 0) return ResponseHandler.sendErrorResponse({ res, code: HTTP_CODES.NOT_FOUND, error: "No attendance record for that day" });
          return ResponseHandler.sendSuccessResponse({ res, code: HTTP_CODES.OK, message: "Attendance retrieved", data: records });
        }
        // Other staff roles
        const dt = new Date(date);
        const records = await attendanceRepository.findAllByDateAndType(dt, userType);
        if (!records || records.length === 0) return ResponseHandler.sendErrorResponse({ res, code: HTTP_CODES.NOT_FOUND, error: "No attendance record for that day" });
        return ResponseHandler.sendSuccessResponse({ res, code: HTTP_CODES.OK, message: "Attendance retrieved", data: records });
      }

      // Date only: return attendance for that date (any userType)
      if (date) {
        const dt = new Date(date);
        const records = await attendanceRepository.findAllByDate(dt);
        if (!records || records.length === 0) return ResponseHandler.sendErrorResponse({ res, code: HTTP_CODES.NOT_FOUND, error: "No attendance record for that day" });
        if (groupBy === "userType") {
          const grouped = records.reduce((acc: any, r: any) => {
            acc[r.userType] = acc[r.userType] || [];
            acc[r.userType].push(r);
            return acc;
          }, {});
          return ResponseHandler.sendSuccessResponse({ res, code: HTTP_CODES.OK, message: "Attendance retrieved", data: grouped });
        }
        return ResponseHandler.sendSuccessResponse({ res, code: HTTP_CODES.OK, message: "Attendance retrieved", data: records });
      }

      // userType only: scope by school for students/teachers
      if (userType) {
        if (String(userType) === ROLE.STUDENT) {
          const studentIds = await studentRepository.findIdsBySchool(schoolId);
          const records = await attendanceRepository.findByUserIds(studentIds);
          if (!records || records.length === 0) return ResponseHandler.sendErrorResponse({ res, code: HTTP_CODES.NOT_FOUND, error: "No attendance records for students in this school" });
          return ResponseHandler.sendSuccessResponse({ res, code: HTTP_CODES.OK, message: "Attendance retrieved", data: records });
        }
        if (String(userType) === ROLE.TEACHER) {
          const teacherIds = await teacherRepository.findIdsBySchool(schoolId);
          const records = await attendanceRepository.findByUserIds(teacherIds);
          if (!records || records.length === 0) return ResponseHandler.sendErrorResponse({ res, code: HTTP_CODES.NOT_FOUND, error: "No attendance records for teachers in this school" });
          return ResponseHandler.sendSuccessResponse({ res, code: HTTP_CODES.OK, message: "Attendance retrieved", data: records });
        }
        const records = await attendanceRepository.findAllByUserType(userType);
        if (!records || records.length === 0) return ResponseHandler.sendErrorResponse({ res, code: HTTP_CODES.NOT_FOUND, error: "No attendance records for this userType" });
        return ResponseHandler.sendSuccessResponse({ res, code: HTTP_CODES.OK, message: "Attendance retrieved", data: records });
      }

      return ResponseHandler.sendErrorResponse({ res, code: HTTP_CODES.BAD_REQUEST, error: "Provide date or userId or userType" });
    } catch (error: any) {
      logger.error(`Error in listAttendance: ${error.message}`);
      return ResponseHandler.sendErrorResponse({ res, code: HTTP_CODES.INTERNAL_SERVER_ERROR, error: "Internal server error" });
    }
  }


}


export default new AttendanceController();
