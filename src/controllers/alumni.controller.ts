import { Response } from "express";
import ResponseHandler from "../utils/response-handler";
import { HTTP_CODES } from "../config/constants";
import Logger from "../utils/logger";
import { ExpressRequest } from "../app";
import alumniRepository from "../repository/alumni.repository";
import schoolRepository from "../repository/school.repository";

const logger = new Logger("Alumni Controller");

class AlumniController {
  // Add alumni
  async addAlumni(req: ExpressRequest, res: Response) {
    try {
      const schoolId = req.params.schoolId;
      const { fullName, yearGraduated, currentOccupation, contact } = req.body;
            const school = (req as any).school ?? (await schoolRepository.findOne({ id: schoolId }));
      
            if (!school) {
              return ResponseHandler.sendErrorResponse({
                res,
                code: HTTP_CODES.NOT_FOUND,
                error: "School not found",
              });
            }
      const alumni = await alumniRepository.create({ fullName, yearGraduated, currentOccupation, contact });
      return ResponseHandler.sendSuccessResponse({ res, code: HTTP_CODES.CREATED, message: "Alumni added", data: alumni });
    } catch (error: any) {
      logger.error(`Error in addAlumni: ${error.message}`);
      return ResponseHandler.sendErrorResponse({ res, code: HTTP_CODES.INTERNAL_SERVER_ERROR, error: "Internal server error" });
    }
  }

  // Get alumni
  async getAlumni(req: ExpressRequest, res: Response) {
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
      const alumnus = await alumniRepository.findOne({ id });
      if (!alumnus) return ResponseHandler.sendErrorResponse({ res, code: HTTP_CODES.NOT_FOUND, error: "Alumni not found" });
      return ResponseHandler.sendSuccessResponse({ res, code: HTTP_CODES.OK, message: "Alumni retrieved", data: alumnus });
    } catch (error: any) {
      logger.error(`Error in getAlumni: ${error.message}`);
      return ResponseHandler.sendErrorResponse({ res, code: HTTP_CODES.INTERNAL_SERVER_ERROR, error: "Internal server error" });
    }
  }

  // List alumni
  async listAlumni(req: ExpressRequest, res: Response) {
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
      const list = await alumniRepository.findAll();
      return ResponseHandler.sendSuccessResponse({ res, code: HTTP_CODES.OK, message: "Alumni retrieved", data: list });
    } catch (error: any) {
      logger.error(`Error in listAlumni: ${error.message}`);
      return ResponseHandler.sendErrorResponse({ res, code: HTTP_CODES.INTERNAL_SERVER_ERROR, error: "Internal server error" });
    }
  }

  // Update alumni
  async updateAlumni(req: ExpressRequest, res: Response) {
    try {
       const schoolId = req.params.schoolId;
       const id = req.params.id;
            const school = (req as any).school ?? (await schoolRepository.findOne({ id: schoolId }));
      
            if (!school) {
              return ResponseHandler.sendErrorResponse({
                res,
                code: HTTP_CODES.NOT_FOUND,
                error: "School not found",
              });
            }
      const updated = await alumniRepository.atomicUpdate({ id }, req.body);
      if (!updated) return ResponseHandler.sendErrorResponse({ res, code: HTTP_CODES.NOT_FOUND, error: "Alumni not found" });
      return ResponseHandler.sendSuccessResponse({ res, code: HTTP_CODES.OK, message: "Alumni updated", data: updated });
    } catch (error: any) {
      logger.error(`Error in updateAlumni: ${error.message}`);
      return ResponseHandler.sendErrorResponse({ res, code: HTTP_CODES.INTERNAL_SERVER_ERROR, error: "Internal server error" });
    }
  }

  // Delete alumni
  async deleteAlumni(req: ExpressRequest, res: Response) {
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
      const ok = await alumniRepository.deleteOne({ id });
      if (!ok) return ResponseHandler.sendErrorResponse({ res, code: HTTP_CODES.NOT_FOUND, error: "Alumni not found" });
      return ResponseHandler.sendSuccessResponse({ res, code: HTTP_CODES.OK, message: "Alumni deleted" });
    } catch (error: any) {
      logger.error(`Error in deleteAlumni: ${error.message}`);
      return ResponseHandler.sendErrorResponse({ res, code: HTTP_CODES.INTERNAL_SERVER_ERROR, error: "Internal server error" });
    }
  }
}


export default new AlumniController();
