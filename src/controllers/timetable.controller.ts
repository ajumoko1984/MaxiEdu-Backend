import { Response } from "express";
import ResponseHandler from "../utils/response-handler";
import { HTTP_CODES } from "../config/constants";
import Logger from "../utils/logger";
import { ExpressRequest } from "../app";
import timetableRepository from "../repository/timetable.repository";

const logger = new Logger("Timetable Controller");

class TimetableController {
  async addTimetable(req: ExpressRequest, res: Response) {
    try {
      const { day, startTime, endTime, subject, teacher } = req.body;
      const tt = await timetableRepository.create({ day, startTime, endTime, subject, teacher });
      return ResponseHandler.sendSuccessResponse({ res, code: HTTP_CODES.CREATED, message: "Timetable added", data: tt });
    } catch (error: any) {
      logger.error(`Error in addTimetable: ${error.message}`);
      return ResponseHandler.sendErrorResponse({ res, code: HTTP_CODES.INTERNAL_SERVER_ERROR, error: "Internal server error" });
    }
  }

  async listTimetable(req: ExpressRequest, res: Response) {
    try {
      const list = await timetableRepository.findAll();
      return ResponseHandler.sendSuccessResponse({ res, code: HTTP_CODES.OK, message: "Timetable retrieved", data: list });
    } catch (error: any) {
      logger.error(`Error in listTimetable: ${error.message}`);
      return ResponseHandler.sendErrorResponse({ res, code: HTTP_CODES.INTERNAL_SERVER_ERROR, error: "Internal server error" });
    }
  }

  async getTimetable(req: ExpressRequest, res: Response) {
    try {
      const id = req.params.id;
      const tt = await timetableRepository.findOne({ id });
      if (!tt) return ResponseHandler.sendErrorResponse({ res, code: HTTP_CODES.NOT_FOUND, error: "Timetable not found" });
      return ResponseHandler.sendSuccessResponse({ res, code: HTTP_CODES.OK, message: "Timetable retrieved", data: tt });
    } catch (error: any) {
      logger.error(`Error in getTimetable: ${error.message}`);
      return ResponseHandler.sendErrorResponse({ res, code: HTTP_CODES.INTERNAL_SERVER_ERROR, error: "Internal server error" });
    }
  }

  async updateTimetable(req: ExpressRequest, res: Response) {
    try {
      const id = req.params.id;
      const updated = await timetableRepository.atomicUpdate({ id }, req.body);
      if (!updated) return ResponseHandler.sendErrorResponse({ res, code: HTTP_CODES.NOT_FOUND, error: "Timetable not found" });
      return ResponseHandler.sendSuccessResponse({ res, code: HTTP_CODES.OK, message: "Timetable updated", data: updated });
    } catch (error: any) {
      logger.error(`Error in updateTimetable: ${error.message}`);
      return ResponseHandler.sendErrorResponse({ res, code: HTTP_CODES.INTERNAL_SERVER_ERROR, error: "Internal server error" });
    }
  }

  async deleteTimetable(req: ExpressRequest, res: Response) {
    try {
      const id = req.params.id;
      const ok = await timetableRepository.deleteOne({ id });
      if (!ok) return ResponseHandler.sendErrorResponse({ res, code: HTTP_CODES.NOT_FOUND, error: "Timetable not found" });
      return ResponseHandler.sendSuccessResponse({ res, code: HTTP_CODES.OK, message: "Timetable deleted" });
    } catch (error: any) {
      logger.error(`Error in deleteTimetable: ${error.message}`);
      return ResponseHandler.sendErrorResponse({ res, code: HTTP_CODES.INTERNAL_SERVER_ERROR, error: "Internal server error" });
    }
  }
}

export default new TimetableController();