import { Response } from "express";
import ResponseHandler from "../utils/response-handler";
import { HTTP_CODES } from "../config/constants";
import Logger from "../utils/logger";
import { ExpressRequest } from "../app";
import sessionRepository from "../repository/session.repository";
import examRepository from "../repository/exam.repository";

const logger = new Logger("Sessions and Exams Controller");

class SessionsExamsController {
  // Create session
  async createSession(req: ExpressRequest, res: Response) {
    try {
      const { sessionName, startDate, endDate, isOpen } = req.body;
      const session = await sessionRepository.create({ sessionName, startDate, endDate, isOpen });
      return ResponseHandler.sendSuccessResponse({ res, code: HTTP_CODES.CREATED, message: "Session created", data: session });
    } catch (error: any) {
      logger.error(`Error in createSession: ${error.message}`);
      return ResponseHandler.sendErrorResponse({ res, code: HTTP_CODES.INTERNAL_SERVER_ERROR, error: "Internal server error" });
    }
  }

  // Create exam
  async createExam(req: ExpressRequest, res: Response) {
    try {
      const { name, sessionId, description } = req.body;
      const exam = await examRepository.create({ name, sessionId, description });
      return ResponseHandler.sendSuccessResponse({ res, code: HTTP_CODES.CREATED, message: "Exam created", data: exam });
    } catch (error: any) {
      logger.error(`Error in createExam: ${error.message}`);
      return ResponseHandler.sendErrorResponse({ res, code: HTTP_CODES.INTERNAL_SERVER_ERROR, error: "Internal server error" });
    }
  }

  // List sessions
  async listSessions(req: ExpressRequest, res: Response) {
    try {
      const sessions = await sessionRepository.findAll();
      return ResponseHandler.sendSuccessResponse({ res, code: HTTP_CODES.OK, message: "Sessions retrieved", data: sessions });
    } catch (error: any) {
      logger.error(`Error in listSessions: ${error.message}`);
      return ResponseHandler.sendErrorResponse({ res, code: HTTP_CODES.INTERNAL_SERVER_ERROR, error: "Internal server error" });
    }
  }

  // Get session
  async getSession(req: ExpressRequest, res: Response) {
    try {
      const id = req.params.id;
      const session = await sessionRepository.findOne({ id });
      if (!session) return ResponseHandler.sendErrorResponse({ res, code: HTTP_CODES.NOT_FOUND, error: "Session not found" });
      return ResponseHandler.sendSuccessResponse({ res, code: HTTP_CODES.OK, message: "Session retrieved", data: session });
    } catch (error: any) {
      logger.error(`Error in getSession: ${error.message}`);
      return ResponseHandler.sendErrorResponse({ res, code: HTTP_CODES.INTERNAL_SERVER_ERROR, error: "Internal server error" });
    }
  }

  // Update session
  async updateSession(req: ExpressRequest, res: Response) {
    try {
      const id = req.params.id;
      const updated = await sessionRepository.atomicUpdate({ id }, req.body);
      if (!updated) return ResponseHandler.sendErrorResponse({ res, code: HTTP_CODES.NOT_FOUND, error: "Session not found" });
      return ResponseHandler.sendSuccessResponse({ res, code: HTTP_CODES.OK, message: "Session updated", data: updated });
    } catch (error: any) {
      logger.error(`Error in updateSession: ${error.message}`);
      return ResponseHandler.sendErrorResponse({ res, code: HTTP_CODES.INTERNAL_SERVER_ERROR, error: "Internal server error" });
    }
  }

  // Delete session
  async deleteSession(req: ExpressRequest, res: Response) {
    try {
      const id = req.params.id;
      const ok = await sessionRepository.deleteOne({ id });
      if (!ok) return ResponseHandler.sendErrorResponse({ res, code: HTTP_CODES.NOT_FOUND, error: "Session not found" });
      return ResponseHandler.sendSuccessResponse({ res, code: HTTP_CODES.OK, message: "Session deleted" });
    } catch (error: any) {
      logger.error(`Error in deleteSession: ${error.message}`);
      return ResponseHandler.sendErrorResponse({ res, code: HTTP_CODES.INTERNAL_SERVER_ERROR, error: "Internal server error" });
    }
  }

  // List exams
  async listExams(req: ExpressRequest, res: Response) {
    try {
      const exams = await examRepository.findAll();
      return ResponseHandler.sendSuccessResponse({ res, code: HTTP_CODES.OK, message: "Exams retrieved", data: exams });
    } catch (error: any) {
      logger.error(`Error in listExams: ${error.message}`);
      return ResponseHandler.sendErrorResponse({ res, code: HTTP_CODES.INTERNAL_SERVER_ERROR, error: "Internal server error" });
    }
  }

  // Get exam
  async getExam(req: ExpressRequest, res: Response) {
    try {
      const id = req.params.id;
      const exam = await examRepository.findOne({ id });
      if (!exam) return ResponseHandler.sendErrorResponse({ res, code: HTTP_CODES.NOT_FOUND, error: "Exam not found" });
      return ResponseHandler.sendSuccessResponse({ res, code: HTTP_CODES.OK, message: "Exam retrieved", data: exam });
    } catch (error: any) {
      logger.error(`Error in getExam: ${error.message}`);
      return ResponseHandler.sendErrorResponse({ res, code: HTTP_CODES.INTERNAL_SERVER_ERROR, error: "Internal server error" });
    }
  }

  // Update exam
  async updateExam(req: ExpressRequest, res: Response) {
    try {
      const id = req.params.id;
      const updated = await examRepository.atomicUpdate({ id }, req.body);
      if (!updated) return ResponseHandler.sendErrorResponse({ res, code: HTTP_CODES.NOT_FOUND, error: "Exam not found" });
      return ResponseHandler.sendSuccessResponse({ res, code: HTTP_CODES.OK, message: "Exam updated", data: updated });
    } catch (error: any) {
      logger.error(`Error in updateExam: ${error.message}`);
      return ResponseHandler.sendErrorResponse({ res, code: HTTP_CODES.INTERNAL_SERVER_ERROR, error: "Internal server error" });
    }
  }

  // Delete exam
  async deleteExam(req: ExpressRequest, res: Response) {
    try {
      const id = req.params.id;
      const ok = await examRepository.deleteOne({ id });
      if (!ok) return ResponseHandler.sendErrorResponse({ res, code: HTTP_CODES.NOT_FOUND, error: "Exam not found" });
      return ResponseHandler.sendSuccessResponse({ res, code: HTTP_CODES.OK, message: "Exam deleted" });
    } catch (error: any) {
      logger.error(`Error in deleteExam: ${error.message}`);
      return ResponseHandler.sendErrorResponse({ res, code: HTTP_CODES.INTERNAL_SERVER_ERROR, error: "Internal server error" });
    }
  }

}


export default new SessionsExamsController();
