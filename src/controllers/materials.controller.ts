import { Response } from "express";
import ResponseHandler from "../utils/response-handler";
import { HTTP_CODES } from "../config/constants";
import Logger from "../utils/logger";
import { ExpressRequest } from "../app";
import materialRepository from "../repository/material.repository";

const logger = new Logger("Materials Controller");

class MaterialsController {
  // Add material
  async addMaterial(req: ExpressRequest, res: Response) {
    try {
      const schoolId = req.params.schoolId;
      const { title, description, fileUrl, fileType, uploadedBy } = req.body;
      const exists = await materialRepository.findAllBySchool(schoolId);
      // simple check: allow duplicates but no strict enforcement
      const material = await materialRepository.create({ schoolId, title, description, fileUrl, fileType, uploadedBy });
      return ResponseHandler.sendSuccessResponse({ res, code: HTTP_CODES.CREATED, message: "Material added", data: material });
    } catch (error: any) {
      logger.error(`Error in addMaterial: ${error.message}`);
      return ResponseHandler.sendErrorResponse({ res, code: HTTP_CODES.INTERNAL_SERVER_ERROR, error: "Internal server error" });
    }
  }

  // Get material
  async getMaterial(req: ExpressRequest, res: Response) {
    try {
      const id = req.params.id;
      const material = await materialRepository.findOne({ id });
      if (!material) return ResponseHandler.sendErrorResponse({ res, code: HTTP_CODES.NOT_FOUND, error: "Material not found" });
      return ResponseHandler.sendSuccessResponse({ res, code: HTTP_CODES.OK, message: "Material retrieved", data: material });
    } catch (error: any) {
      logger.error(`Error in getMaterial: ${error.message}`);
      return ResponseHandler.sendErrorResponse({ res, code: HTTP_CODES.INTERNAL_SERVER_ERROR, error: "Internal server error" });
    }
  }

  // List materials
  async listMaterials(req: ExpressRequest, res: Response) {
    try {
      const schoolId = req.params.schoolId;
      const materials = await materialRepository.findAllBySchool(schoolId);
      return ResponseHandler.sendSuccessResponse({ res, code: HTTP_CODES.OK, message: "Materials retrieved", data: materials });
    } catch (error: any) {
      logger.error(`Error in listMaterials: ${error.message}`);
      return ResponseHandler.sendErrorResponse({ res, code: HTTP_CODES.INTERNAL_SERVER_ERROR, error: "Internal server error" });
    }
  }

  // Update material
  async updateMaterial(req: ExpressRequest, res: Response) {
    try {
      const id = req.params.id;
      const data = req.body;
      const updated = await materialRepository.atomicUpdate({ id }, data);
      if (!updated) return ResponseHandler.sendErrorResponse({ res, code: HTTP_CODES.NOT_FOUND, error: "Material not found" });
      return ResponseHandler.sendSuccessResponse({ res, code: HTTP_CODES.OK, message: "Material updated", data: updated });
    } catch (error: any) {
      logger.error(`Error in updateMaterial: ${error.message}`);
      return ResponseHandler.sendErrorResponse({ res, code: HTTP_CODES.INTERNAL_SERVER_ERROR, error: "Internal server error" });
    }
  }

  // Delete material
  async deleteMaterial(req: ExpressRequest, res: Response) {
    try {
      const id = req.params.id;
      const ok = await materialRepository.deleteOne({ id });
      if (!ok) return ResponseHandler.sendErrorResponse({ res, code: HTTP_CODES.NOT_FOUND, error: "Material not found" });
      return ResponseHandler.sendSuccessResponse({ res, code: HTTP_CODES.OK, message: "Material deleted" });
    } catch (error: any) {
      logger.error(`Error in deleteMaterial: ${error.message}`);
      return ResponseHandler.sendErrorResponse({ res, code: HTTP_CODES.INTERNAL_SERVER_ERROR, error: "Internal server error" });
    }
  }
}


export default new MaterialsController();
