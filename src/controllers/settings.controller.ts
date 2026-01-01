import { Response } from "express";
import ResponseHandler from "../utils/response-handler";
import { HTTP_CODES } from "../config/constants";
import Logger from "../utils/logger";
import { ExpressRequest } from "../app";
import settingRepository from "../repository/setting.repository";

const logger = new Logger("Setting Controller");

class SettingController {
  // Create setting
  async createSetting(req: ExpressRequest, res: Response) {
    try {
      const { settingKey, value, themeColor } = req.body;
      const setting = await settingRepository.create({ settingKey, value, themeColor });
      return ResponseHandler.sendSuccessResponse({ res, code: HTTP_CODES.CREATED, message: "Setting created", data: setting });
    } catch (error: any) {
      logger.error(`Error in createSetting: ${error.message}`);
      return ResponseHandler.sendErrorResponse({ res, code: HTTP_CODES.INTERNAL_SERVER_ERROR, error: "Internal server error" });
    }
  }

  // Get setting
  async getSetting(req: ExpressRequest, res: Response) {
    try {
      const id = req.params.id;
      const setting = await settingRepository.findOne({ id });
      if (!setting) return ResponseHandler.sendErrorResponse({ res, code: HTTP_CODES.NOT_FOUND, error: "Setting not found" });
      return ResponseHandler.sendSuccessResponse({ res, code: HTTP_CODES.OK, message: "Setting retrieved", data: setting });
    } catch (error: any) {
      logger.error(`Error in getSetting: ${error.message}`);
      return ResponseHandler.sendErrorResponse({ res, code: HTTP_CODES.INTERNAL_SERVER_ERROR, error: "Internal server error" });
    }
  }

  // List settings
  async listSettings(req: ExpressRequest, res: Response) {
    try {
      const settings = await settingRepository.findAll();
      return ResponseHandler.sendSuccessResponse({ res, code: HTTP_CODES.OK, message: "Settings retrieved", data: settings });
    } catch (error: any) {
      logger.error(`Error in listSettings: ${error.message}`);
      return ResponseHandler.sendErrorResponse({ res, code: HTTP_CODES.INTERNAL_SERVER_ERROR, error: "Internal server error" });
    }
  }

  // Update setting
  async updateSetting(req: ExpressRequest, res: Response) {
    try {
      const id = req.params.id;
      const updated = await settingRepository.atomicUpdate({ id }, req.body);
      if (!updated) return ResponseHandler.sendErrorResponse({ res, code: HTTP_CODES.NOT_FOUND, error: "Setting not found" });
      return ResponseHandler.sendSuccessResponse({ res, code: HTTP_CODES.OK, message: "Setting updated", data: updated });
    } catch (error: any) {
      logger.error(`Error in updateSetting: ${error.message}`);
      return ResponseHandler.sendErrorResponse({ res, code: HTTP_CODES.INTERNAL_SERVER_ERROR, error: "Internal server error" });
    }
  }

  // Delete setting
  async deleteSetting(req: ExpressRequest, res: Response) {
    try {
      const id = req.params.id;
      const ok = await settingRepository.deleteOne({ id });
      if (!ok) return ResponseHandler.sendErrorResponse({ res, code: HTTP_CODES.NOT_FOUND, error: "Setting not found" });
      return ResponseHandler.sendSuccessResponse({ res, code: HTTP_CODES.OK, message: "Setting deleted" });
    } catch (error: any) {
      logger.error(`Error in deleteSetting: ${error.message}`);
      return ResponseHandler.sendErrorResponse({ res, code: HTTP_CODES.INTERNAL_SERVER_ERROR, error: "Internal server error" });
    }
  }

}


export default new SettingController();
