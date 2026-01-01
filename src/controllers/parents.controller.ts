import { Response } from "express";
import ResponseHandler from "../utils/response-handler";
import { HTTP_CODES } from "../config/constants";
import Logger from "../utils/logger";
import { ExpressRequest } from "../app";
import parentRepository from "../repository/parent.repository";

const logger = new Logger("Parent Controller");

class ParentController {
 // Add parent
  async addParent(req: ExpressRequest, res: Response) {
    try {
      const schoolId = req.params.schoolId;
      const { fullName, relationship, email, phonePrimary, phoneAlternative, homeAddress, occupation, placeOfWork, password } = req.body;

      const exists = await parentRepository.findOne({ email });
      if (exists) {
        return ResponseHandler.sendErrorResponse({
          res,
          code: HTTP_CODES.CONFLICT,
          error: "Parent with this email already exists",
        });
      }

      const parent = await parentRepository.create({
        schoolId,
        fullName,
        relationship,
        email,
        phonePrimary,
        phoneAlternative,
        homeAddress,
        occupation,
        placeOfWork,
        password,
      });

      return ResponseHandler.sendSuccessResponse({
        res,
        code: HTTP_CODES.CREATED,
        message: "Parent added successfully",
        data: parent,
      });
    } catch (error: any) {
      logger.error(`Error in addParent: ${error.message}`);
      return ResponseHandler.sendErrorResponse({
        res,
        code: HTTP_CODES.INTERNAL_SERVER_ERROR,
        error: "Internal server error",
      });
    }
  }

  // Get parent
  async getParent(req: ExpressRequest, res: Response) {
    try {
      const id = req.params.id;
      const parent = await parentRepository.findOne({ id });
      if (!parent) return ResponseHandler.sendErrorResponse({ res, code: HTTP_CODES.NOT_FOUND, error: "Parent not found" });
      return ResponseHandler.sendSuccessResponse({ res, code: HTTP_CODES.OK, message: "Parent retrieved successfully", data: parent });
    } catch (error: any) {
      logger.error(`Error in getParent: ${error.message}`);
      return ResponseHandler.sendErrorResponse({ res, code: HTTP_CODES.INTERNAL_SERVER_ERROR, error: "Internal server error" });
    }
  }

  // List parents
  async listParents(req: ExpressRequest, res: Response) {
    try {
      const schoolId = req.params.schoolId;
      const parents = await parentRepository.findAllBySchool(schoolId, req.query);

      return ResponseHandler.sendSuccessResponse({
        res,
        code: HTTP_CODES.OK,
        message: "Parents retrieved successfully",
        data: parents,
      });
    } catch (error: any) {
      logger.error(`Error in listParents: ${error.message}`);
      return ResponseHandler.sendErrorResponse({
        res,
        code: HTTP_CODES.INTERNAL_SERVER_ERROR,
        error: "Internal server error",
      });
    }
  }

  // Update parent
  async updateParent(req: ExpressRequest, res: Response) {
    try {
      const id = req.params.id;
      const updated = await parentRepository.atomicUpdate({ id }, req.body);
      if (!updated) return ResponseHandler.sendErrorResponse({ res, code: HTTP_CODES.NOT_FOUND, error: "Parent not found" });
      return ResponseHandler.sendSuccessResponse({ res, code: HTTP_CODES.OK, message: "Parent updated successfully", data: updated });
    } catch (error: any) {
      logger.error(`Error in updateParent: ${error.message}`);
      return ResponseHandler.sendErrorResponse({ res, code: HTTP_CODES.INTERNAL_SERVER_ERROR, error: "Internal server error" });
    }
  }

  // Delete parent
  async deleteParent(req: ExpressRequest, res: Response) {
    try {
      const id = req.params.id;
      const ok = await parentRepository.deleteOne({ id });
      if (!ok) return ResponseHandler.sendErrorResponse({ res, code: HTTP_CODES.NOT_FOUND, error: "Parent not found" });
      return ResponseHandler.sendSuccessResponse({ res, code: HTTP_CODES.OK, message: "Parent deleted" });
    } catch (error: any) {
      logger.error(`Error in deleteParent: ${error.message}`);
      return ResponseHandler.sendErrorResponse({ res, code: HTTP_CODES.INTERNAL_SERVER_ERROR, error: "Internal server error" });
    }
  }
}


export default new ParentController();
