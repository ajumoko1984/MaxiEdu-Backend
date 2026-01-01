import { Response } from "express";
import ResponseHandler from "../utils/response-handler";
import { HTTP_CODES } from "../config/constants";
import Logger from "../utils/logger";
import { ExpressRequest } from "../app";
import scoreRepository from "../repository/score.repository";

const logger = new Logger("Score Controller");

class ScoreController {
  // Add score
  async addScore(req: ExpressRequest, res: Response) {
    try {
      const { scoreId, subjectId, studentId, classId, examId, sessionId, firstCA = 0, secondCA = 0, exam = 0 } = req.body;
      const total = Number(firstCA) + Number(secondCA) + Number(exam);
      const score = await scoreRepository.create({ scoreId, subjectId, studentId, classId, examId, sessionId, firstCA, secondCA, exam, total });
      return ResponseHandler.sendSuccessResponse({ res, code: HTTP_CODES.CREATED, message: "Score added", data: score });
    } catch (error: any) {
      logger.error(`Error in addScore: ${error.message}`);
      return ResponseHandler.sendErrorResponse({ res, code: HTTP_CODES.INTERNAL_SERVER_ERROR, error: "Internal server error" });
    }
  }

  // Get score
  async getScore(req: ExpressRequest, res: Response) {
    try {
      const id = req.params.id;
      const score = await scoreRepository.findOne({ id });
      if (!score) return ResponseHandler.sendErrorResponse({ res, code: HTTP_CODES.NOT_FOUND, error: "Score not found" });
      return ResponseHandler.sendSuccessResponse({ res, code: HTTP_CODES.OK, message: "Score retrieved", data: score });
    } catch (error: any) {
      logger.error(`Error in getScore: ${error.message}`);
      return ResponseHandler.sendErrorResponse({ res, code: HTTP_CODES.INTERNAL_SERVER_ERROR, error: "Internal server error" });
    }
  }

  // List scores for a student
  async listScoresByStudent(req: ExpressRequest, res: Response) {
    try {
      const studentId = req.params.studentId;
      const scores = await scoreRepository.findByStudent(studentId);
      return ResponseHandler.sendSuccessResponse({ res, code: HTTP_CODES.OK, message: "Scores retrieved", data: scores });
    } catch (error: any) {
      logger.error(`Error in listScoresByStudent: ${error.message}`);
      return ResponseHandler.sendErrorResponse({ res, code: HTTP_CODES.INTERNAL_SERVER_ERROR, error: "Internal server error" });
    }
  }

  // Update score
  async updateScore(req: ExpressRequest, res: Response) {
    try {
      const id = req.params.id;
      const data = req.body;
      if (data.firstCA || data.secondCA || data.exam) {
        const total = (Number(data.firstCA) || 0) + (Number(data.secondCA) || 0) + (Number(data.exam) || 0);
        data.total = total;
      }
      const updated = await scoreRepository.atomicUpdate({ id }, data);
      if (!updated) return ResponseHandler.sendErrorResponse({ res, code: HTTP_CODES.NOT_FOUND, error: "Score not found" });
      return ResponseHandler.sendSuccessResponse({ res, code: HTTP_CODES.OK, message: "Score updated", data: updated });
    } catch (error: any) {
      logger.error(`Error in updateScore: ${error.message}`);
      return ResponseHandler.sendErrorResponse({ res, code: HTTP_CODES.INTERNAL_SERVER_ERROR, error: "Internal server error" });
    }
  }

  // Delete score
  async deleteScore(req: ExpressRequest, res: Response) {
    try {
      const id = req.params.id;
      const ok = await scoreRepository.deleteOne({ id });
      if (!ok) return ResponseHandler.sendErrorResponse({ res, code: HTTP_CODES.NOT_FOUND, error: "Score not found" });
      return ResponseHandler.sendSuccessResponse({ res, code: HTTP_CODES.OK, message: "Score deleted" });
    } catch (error: any) {
      logger.error(`Error in deleteScore: ${error.message}`);
      return ResponseHandler.sendErrorResponse({ res, code: HTTP_CODES.INTERNAL_SERVER_ERROR, error: "Internal server error" });
    }
  }
}


export default new ScoreController();
