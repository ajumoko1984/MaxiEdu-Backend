import { Response } from "express";
import ResponseHandler from "../utils/response-handler";
import { HTTP_CODES } from "../config/constants";
import Logger from "../utils/logger";
import { ExpressRequest } from "../app";
import teacherRepository from "../repository/teacher.repository";
import schoolRepository from "../repository/school.repository";

const logger = new Logger("Teacher Controller");

class TeacherController {
  // Add teacher
  async addTeacher(req: ExpressRequest, res: Response) {
    try {
      const schoolId = req.params.schoolId;
      const { firstName, otherNames, lastName, email, phoneNumber, subjects } =
        req.body;
      // Check if teacher with the same email already exists
      const exists = await teacherRepository.findOne({ email });
      if (exists) {
        return ResponseHandler.sendErrorResponse({
          res,
          code: HTTP_CODES.CONFLICT,
          error: "Teacher with this email already exists",
        });
      }

      // Create the teacher
      const teacher = await teacherRepository.create({
        schoolId,
        firstName,
        otherNames,
        lastName,
        email,
        phoneNumber,
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
      const teachers = await teacherRepository.findAllBySchool(
        schoolId,
        req.query
      );

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

  // Get teacher
  async getTeacher(req: ExpressRequest, res: Response) {
    try {
      const id = req.params.id;
      const teacher = await teacherRepository.findOne({ id });
      if (!teacher)
        return ResponseHandler.sendErrorResponse({
          res,
          code: HTTP_CODES.NOT_FOUND,
          error: "Teacher not found",
        });
      return ResponseHandler.sendSuccessResponse({
        res,
        code: HTTP_CODES.OK,
        message: "Teacher retrieved successfully",
        data: teacher,
      });
    } catch (error: any) {
      logger.error(`Error in getTeacher: ${error.message}`);
      return ResponseHandler.sendErrorResponse({
        res,
        code: HTTP_CODES.INTERNAL_SERVER_ERROR,
        error: "Internal server error",
      });
    }
  }

  // Update teacher
  async updateTeacher(req: ExpressRequest, res: Response) {
    try {
      const id = req.params.id;
      const updated = await teacherRepository.atomicUpdate({ id }, req.body);
      if (!updated)
        return ResponseHandler.sendErrorResponse({
          res,
          code: HTTP_CODES.NOT_FOUND,
          error: "Teacher not found",
        });
      return ResponseHandler.sendSuccessResponse({
        res,
        code: HTTP_CODES.OK,
        message: "Teacher updated successfully",
        data: updated,
      });
    } catch (error: any) {
      logger.error(`Error in updateTeacher: ${error.message}`);
      return ResponseHandler.sendErrorResponse({
        res,
        code: HTTP_CODES.INTERNAL_SERVER_ERROR,
        error: "Internal server error",
      });
    }
  }

  // Delete teacher
  async deleteTeacher(req: ExpressRequest, res: Response) {
    try {
      const id = req.params.id;
      const ok = await teacherRepository.deleteOne({ id });
      if (!ok)
        return ResponseHandler.sendErrorResponse({
          res,
          code: HTTP_CODES.NOT_FOUND,
          error: "Teacher not found",
        });
      return ResponseHandler.sendSuccessResponse({
        res,
        code: HTTP_CODES.OK,
        message: "Teacher deleted",
      });
    } catch (error: any) {
      logger.error(`Error in deleteTeacher: ${error.message}`);
      return ResponseHandler.sendErrorResponse({
        res,
        code: HTTP_CODES.INTERNAL_SERVER_ERROR,
        error: "Internal server error",
      });
    }
  }
}

export default new TeacherController();
