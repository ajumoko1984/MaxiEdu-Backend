import { Response } from "express";
import ResponseHandler from "../utils/response-handler";
import { HTTP_CODES } from "../config/constants";
import Logger from "../utils/logger";
import { ExpressRequest } from "../app";
import studentRepository from "../repository/student.repository";
import schoolRepository from "../repository/school.repository";

const logger = new Logger("Teacher Controller");

class StudentsController {
  // Add student
  async addStudent(req: ExpressRequest, res: Response) {
    try {
      const schoolId = req.params.schoolId;
      const {
        firstName,
        otherNames,
        lastName,
        classAssigned,
        parentName,
        parentPhone,
        parentId,
      } = req.body;

      const exists = await studentRepository.findOne({ lastName, firstName });
      if (exists) {
        return ResponseHandler.sendErrorResponse({
          res,
          code: HTTP_CODES.CONFLICT,
          error: "Student with this first name and last name already exists",
        });
      }

      const student = await studentRepository.create({
        schoolId,
        firstName,
        otherNames,
        lastName,
        classAssigned,
        parentName,
        parentPhone,
        parentId,
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
      const students = await studentRepository.findAllBySchool(
        schoolId,
        req.query
      );

      // ensureSchoolExists middleware attaches the school to req.school
      const school =
        (req as any).school ??
        (await schoolRepository.findOne({ id: schoolId }));

      if (!school) {
        return ResponseHandler.sendErrorResponse({
          res,
          code: HTTP_CODES.NOT_FOUND,
          error: "School not found",
        });
      }

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

  // Get student
  async getStudent(req: ExpressRequest, res: Response) {
    try {
      const id = req.params.id;
      const student = await studentRepository.findOne({ id });
      if (!student)
        return ResponseHandler.sendErrorResponse({
          res,
          code: HTTP_CODES.NOT_FOUND,
          error: "Student not found",
        });
      return ResponseHandler.sendSuccessResponse({
        res,
        code: HTTP_CODES.OK,
        message: "Student retrieved successfully",
        data: student,
      });
    } catch (error: any) {
      logger.error(`Error in getStudent: ${error.message}`);
      return ResponseHandler.sendErrorResponse({
        res,
        code: HTTP_CODES.INTERNAL_SERVER_ERROR,
        error: "Internal server error",
      });
    }
  }

  // Update student
  async updateStudent(req: ExpressRequest, res: Response) {
    try {
      const id = req.params.id;
      const updated = await studentRepository.atomicUpdate({ id }, req.body);
      if (!updated)
        return ResponseHandler.sendErrorResponse({
          res,
          code: HTTP_CODES.NOT_FOUND,
          error: "Student not found",
        });
      return ResponseHandler.sendSuccessResponse({
        res,
        code: HTTP_CODES.OK,
        message: "Student updated successfully",
        data: updated,
      });
    } catch (error: any) {
      logger.error(`Error in updateStudent: ${error.message}`);
      return ResponseHandler.sendErrorResponse({
        res,
        code: HTTP_CODES.INTERNAL_SERVER_ERROR,
        error: "Internal server error",
      });
    }
  }

  // Delete student
  async deleteStudent(req: ExpressRequest, res: Response) {
    try {
      const id = req.params.id;
      const ok = await studentRepository.deleteOne({ id });
      if (!ok)
        return ResponseHandler.sendErrorResponse({
          res,
          code: HTTP_CODES.NOT_FOUND,
          error: "Student not found",
        });
      return ResponseHandler.sendSuccessResponse({
        res,
        code: HTTP_CODES.OK,
        message: "Student deleted",
      });
    } catch (error: any) {
      logger.error(`Error in deleteStudent: ${error.message}`);
      return ResponseHandler.sendErrorResponse({
        res,
        code: HTTP_CODES.INTERNAL_SERVER_ERROR,
        error: "Internal server error",
      });
    }
  }
}

export default new StudentsController();
