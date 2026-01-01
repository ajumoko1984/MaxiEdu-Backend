import { Response } from "express";
import ResponseHandler from "../utils/response-handler";
import { HTTP_CODES } from "../config/constants";
import Logger from "../utils/logger";
import { ExpressRequest } from "../app";
import gradeRepository from "../repository/grade.repository";

const logger = new Logger("Grade Controller");

class GradeController {
  // Add grade
  async addGrade(req: ExpressRequest, res: Response) {
    try {
      const { grade, min, max, description } = req.body;
      const g = await gradeRepository.create({ grade, min, max, description });
      return ResponseHandler.sendSuccessResponse({ res, code: HTTP_CODES.CREATED, message: "Grade added", data: g });
    } catch (error: any) {
      logger.error(`Error in addGrade: ${error.message}`);
      return ResponseHandler.sendErrorResponse({ res, code: HTTP_CODES.INTERNAL_SERVER_ERROR, error: "Internal server error" });
    }
  }

  // Get grade
  async getGrade(req: ExpressRequest, res: Response) {
    try {
      const id = req.params.id;
      const grade = await gradeRepository.findOne({ id });
      if (!grade) return ResponseHandler.sendErrorResponse({ res, code: HTTP_CODES.NOT_FOUND, error: "Grade not found" });
      return ResponseHandler.sendSuccessResponse({ res, code: HTTP_CODES.OK, message: "Grade retrieved", data: grade });
    } catch (error: any) {
      logger.error(`Error in getGrade: ${error.message}`);
      return ResponseHandler.sendErrorResponse({ res, code: HTTP_CODES.INTERNAL_SERVER_ERROR, error: "Internal server error" });
    }
  }

  // List grades
  async listGrades(req: ExpressRequest, res: Response) {
    try {
      const grades = await gradeRepository.findAll();
      return ResponseHandler.sendSuccessResponse({ res, code: HTTP_CODES.OK, message: "Grades retrieved", data: grades });
    } catch (error: any) {
      logger.error(`Error in listGrades: ${error.message}`);
      return ResponseHandler.sendErrorResponse({ res, code: HTTP_CODES.INTERNAL_SERVER_ERROR, error: "Internal server error" });
    }
  }

  // Update grade
  async updateGrade(req: ExpressRequest, res: Response) {
    try {
      const id = req.params.id;
      const updated = await gradeRepository.atomicUpdate({ id }, req.body);
      if (!updated) return ResponseHandler.sendErrorResponse({ res, code: HTTP_CODES.NOT_FOUND, error: "Grade not found" });
      return ResponseHandler.sendSuccessResponse({ res, code: HTTP_CODES.OK, message: "Grade updated", data: updated });
    } catch (error: any) {
      logger.error(`Error in updateGrade: ${error.message}`);
      return ResponseHandler.sendErrorResponse({ res, code: HTTP_CODES.INTERNAL_SERVER_ERROR, error: "Internal server error" });
    }
  }

  // Delete grade
  async deleteGrade(req: ExpressRequest, res: Response) {
    try {
      const id = req.params.id;
      const ok = await gradeRepository.deleteOne({ id });
      if (!ok) return ResponseHandler.sendErrorResponse({ res, code: HTTP_CODES.NOT_FOUND, error: "Grade not found" });
      return ResponseHandler.sendSuccessResponse({ res, code: HTTP_CODES.OK, message: "Grade deleted" });
    } catch (error: any) {
      logger.error(`Error in deleteGrade: ${error.message}`);
      return ResponseHandler.sendErrorResponse({ res, code: HTTP_CODES.INTERNAL_SERVER_ERROR, error: "Internal server error" });
    }
  }

}


export default new GradeController();
