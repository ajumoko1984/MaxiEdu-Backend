import { Response } from "express";
import ResponseHandler from "../utils/response-handler";
import { HTTP_CODES } from "../config/constants";
import Logger from "../utils/logger";
import { ExpressRequest } from "../app";
import classRepository from "../repository/class.repository";
import schoolRepository from "../repository/school.repository";

const logger = new Logger("Class Controller");

class ClassController {
  // Create class
  async createClass(req: ExpressRequest, res: Response) {
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
      const { className, description} = req.body;

      const exists = await classRepository.findOne({ className });
      if (exists) {
        return ResponseHandler.sendErrorResponse({
          res,
          code: HTTP_CODES.CONFLICT,
          error: "Class with this name already exists",
        });
      }

      const schoolClass = await classRepository.create({
        schoolId,
        className,
        description
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

  // List classes
  async listClasses(req: ExpressRequest, res: Response) {
    try {
      const schoolId = req.params.schoolId;
      const classes = await classRepository.findAllBySchool(schoolId, req.query);
      return ResponseHandler.sendSuccessResponse({ res, code: HTTP_CODES.OK, message: "Classes retrieved", data: classes });
    } catch (error: any) {
      logger.error(`Error in listClasses: ${error.message}`);
      return ResponseHandler.sendErrorResponse({ res, code: HTTP_CODES.INTERNAL_SERVER_ERROR, error: "Internal server error" });
    }
  }

  // Get class
  async getClass(req: ExpressRequest, res: Response) {
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
      const id = req.params.id;
      const cls = await classRepository.findOne({ id });
      if (!cls) return ResponseHandler.sendErrorResponse({ res, code: HTTP_CODES.NOT_FOUND, error: "Class not found" });
      return ResponseHandler.sendSuccessResponse({ res, code: HTTP_CODES.OK, message: "Class retrieved", data: cls });
    } catch (error: any) {
      logger.error(`Error in getClass: ${error.message}`);
      return ResponseHandler.sendErrorResponse({ res, code: HTTP_CODES.INTERNAL_SERVER_ERROR, error: "Internal server error" });
    }
  }

  // Update class
  async updateClass(req: ExpressRequest, res: Response) {
    try {
      const id = req.params.id;
      const updated = await classRepository.atomicUpdate({ id }, req.body);
      if (!updated) return ResponseHandler.sendErrorResponse({ res, code: HTTP_CODES.NOT_FOUND, error: "Class not found" });
      return ResponseHandler.sendSuccessResponse({ res, code: HTTP_CODES.OK, message: "Class updated", data: updated });
    } catch (error: any) {
      logger.error(`Error in updateClass: ${error.message}`);
      return ResponseHandler.sendErrorResponse({ res, code: HTTP_CODES.INTERNAL_SERVER_ERROR, error: "Internal server error" });
    }
  }

  // Delete class
  async deleteClass(req: ExpressRequest, res: Response) {
    try {
      const id = req.params.id;
      const ok = await classRepository.deleteOne({ id });
      if (!ok) return ResponseHandler.sendErrorResponse({ res, code: HTTP_CODES.NOT_FOUND, error: "Class not found" });
      return ResponseHandler.sendSuccessResponse({ res, code: HTTP_CODES.OK, message: "Class deleted" });
    } catch (error: any) {
      logger.error(`Error in deleteClass: ${error.message}`);
      return ResponseHandler.sendErrorResponse({ res, code: HTTP_CODES.INTERNAL_SERVER_ERROR, error: "Internal server error" });
    }
  }

}


export default new ClassController();