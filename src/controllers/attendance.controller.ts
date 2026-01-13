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
      const { personId, type, checkInTime, checkOutTime, attenderId, faceRecognitionScore } = req.body;

      // Ensure school exists
      const school = (req as any).school ?? (await schoolRepository.findOne({ id: schoolId }));
      if (!school) {
        return ResponseHandler.sendErrorResponse({
          res,
          code: HTTP_CODES.NOT_FOUND,
          error: "School not found",
        });
      }

      // Validate person exists based on type
      let person;
      if (type === "STU") {
        person = await studentRepository.findOne({ id: personId, schoolId, isActive: true, isDisabled: false, isDeleted: false });
      } else if (type === "TCH") {
        person = await teacherRepository.findOne({ id: personId, schoolId, isActive: true, isDisabled: false, isDeleted: false });
      }
      if (!person) {
        return ResponseHandler.sendErrorResponse({
          res,
          code: HTTP_CODES.BAD_REQUEST,
          error: `${type === "STU" ? "Student" : "Teacher"} not found or inactive/disabled`,
        });
      }

      // Validate attenderId exists (who is recording attendance)
      const attender = await teacherRepository.findOne({ id: attenderId });
      if (!attender) {
        return ResponseHandler.sendErrorResponse({
          res,
          code: HTTP_CODES.BAD_REQUEST,
          error: "Attender not found",
        });
      }

      // Check if attendance already exists today for this person (optional logic for upsert)
      const existingAttendance = await attendanceRepository.findOne({ personId, type });
      if (existingAttendance && !existingAttendance.checkOutTime && checkOutTime) {
        // Update checkOutTime if this is a checkout
        existingAttendance.checkOutTime = checkOutTime;
        existingAttendance.faceRecognitionScore = faceRecognitionScore ?? existingAttendance.faceRecognitionScore;
        const updated = await attendanceRepository.create(existingAttendance);
        return ResponseHandler.sendSuccessResponse({
          res,
          code: HTTP_CODES.OK,
          message: "Attendance updated (checkout)",
          data: updated,
        });
      }

      // Create new attendance record
      const attendance = await attendanceRepository.create({
        personId,
        type,
        checkInTime,
        checkOutTime: checkOutTime || null,
        attenderId,
        faceRecognitionScore: faceRecognitionScore || null,
      });

      return ResponseHandler.sendSuccessResponse({
        res,
        code: HTTP_CODES.CREATED,
        message: "Attendance marked",
        data: attendance,
      });
    } catch (error: any) {
      logger.error(`Error in markAttendance: ${error.message}`);
      return ResponseHandler.sendErrorResponse({
        res,
        code: HTTP_CODES.INTERNAL_SERVER_ERROR,
        error: "Internal server error",
      });
    }
  }

   async updateAttendance(req: ExpressRequest, res: Response) {
      try {
        const id = req.params.id;
        const updated = await attendanceRepository.atomicUpdate({ id }, req.body);
        if (!updated)
          return ResponseHandler.sendErrorResponse({
            res,
            code: HTTP_CODES.NOT_FOUND,
            error: "Attendance not found",
          });
        return ResponseHandler.sendSuccessResponse({
          res,
          code: HTTP_CODES.OK,
          message: "Attendance updated successfully",
          data: updated,
        });
      } catch (error: any) {
        logger.error(`Error in updateAttendance: ${error.message}`);
        return ResponseHandler.sendErrorResponse({
          res,
          code: HTTP_CODES.INTERNAL_SERVER_ERROR,
          error: "Internal server error",
        });
      }
    }


      // Get attendance
      async getAttendance(req: ExpressRequest, res: Response) {
        try {
          const id = req.params.id;
          const attendance = await attendanceRepository.findOne({ id });
          if (!attendance)
            return ResponseHandler.sendErrorResponse({
              res,
              code: HTTP_CODES.NOT_FOUND,
              error: "Attendance not found",
            });
          return ResponseHandler.sendSuccessResponse({
            res,
            code: HTTP_CODES.OK,
            message: "Attendance retrieved successfully",
            data: attendance,
          });
        } catch (error: any) {
          logger.error(`Error in getAttendance: ${error.message}`);
          return ResponseHandler.sendErrorResponse({
            res,
            code: HTTP_CODES.INTERNAL_SERVER_ERROR,
            error: "Internal server error",
          });
        }
      }
  

      
  async listAttendance(req: ExpressRequest, res: Response) {
    try {
      const schoolId = req.params.schoolId;
      const attendances = await attendanceRepository.findAllBySchool(
        schoolId,
        req.query
      );

      return ResponseHandler.sendSuccessResponse({
        res,
        code: HTTP_CODES.OK,
        message: "Attendances retrieved successfully",
        data: attendances,
      });
    } catch (error: any) {
      logger.error(`Error in listAttendance: ${error.message}`);
      return ResponseHandler.sendErrorResponse({
        res,
        code: HTTP_CODES.INTERNAL_SERVER_ERROR,
        error: "Internal server error",
      });
    }
  }


}


export default new AttendanceController();
