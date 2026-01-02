import { Response } from "express";
import ResponseHandler from "../utils/response-handler";
import { HTTP_CODES } from "../config/constants";
import Logger from "../utils/logger";
import { ExpressRequest } from "../app";
import libraryRepository from "../repository/library.repository";

const logger = new Logger("Library Controller");

class LibraryController {
  // Add Library
  async addLibrary(req: ExpressRequest, res: Response) {
    try {
      const { bookName, quantity,  available } = req.body;
      const g = await libraryRepository.create({ bookName, quantity, available });
      return ResponseHandler.sendSuccessResponse({ res, code: HTTP_CODES.CREATED, message: "library added", data: g });
    } catch (error: any) {
      logger.error(`Error in addLibrary: ${error.message}`);
      return ResponseHandler.sendErrorResponse({ res, code: HTTP_CODES.INTERNAL_SERVER_ERROR, error: "Internal server error" });
    }
  }


    // List Library
    async listLibrary(req: ExpressRequest, res: Response) {
      try {
         const schoolId = req.params.schoolId;
              const school = (req as any).school ?? (await libraryRepository.findOne({ id: schoolId }));
        
              if (!school) {
                return ResponseHandler.sendErrorResponse({
                  res,
                  code: HTTP_CODES.NOT_FOUND,
                  error: "School not found",
                });
              }
        const list = await libraryRepository.findAll();
        return ResponseHandler.sendSuccessResponse({ res, code: HTTP_CODES.OK, message: "Library retrieved", data: list });
      } catch (error: any) {
        logger.error(`Error in listLibrary: ${error.message}`);
        return ResponseHandler.sendErrorResponse({ res, code: HTTP_CODES.INTERNAL_SERVER_ERROR, error: "Internal server error" });
      }
    }
  
      async getLibrary(req: ExpressRequest, res: Response) {
        try {
          const id = req.params.id;
          const library = await libraryRepository.findOne({ id });
          if (!library) return ResponseHandler.sendErrorResponse({ res, code: HTTP_CODES.NOT_FOUND, error: "Library not found" });
          return ResponseHandler.sendSuccessResponse({ res, code: HTTP_CODES.OK, message: "Library retrieved", data: library });
        } catch (error: any) {
          logger.error(`Error in getLibrary: ${error.message}`);
          return ResponseHandler.sendErrorResponse({ res, code: HTTP_CODES.INTERNAL_SERVER_ERROR, error: "Internal server error" });
        }
      }

        // Update library
        async updateLibrary(req: ExpressRequest, res: Response) {
          try {
            const id = req.params.id;
            const updated = await libraryRepository.atomicUpdate({ id }, req.body);
            if (!updated) return ResponseHandler.sendErrorResponse({ res, code: HTTP_CODES.NOT_FOUND, error: "Library not found" });
            return ResponseHandler.sendSuccessResponse({ res, code: HTTP_CODES.OK, message: "Library updated", data: updated });
          } catch (error: any) {
            logger.error(`Error in updateLibrary: ${error.message}`);
            return ResponseHandler.sendErrorResponse({ res, code: HTTP_CODES.INTERNAL_SERVER_ERROR, error: "Internal server error" });
          }
        }

          // Delete library
          async deleteLibrary(req: ExpressRequest, res: Response) {
            try {
              const id = req.params.id;
              const ok = await libraryRepository.deleteOne({ id });
              if (!ok) return ResponseHandler.sendErrorResponse({ res, code: HTTP_CODES.NOT_FOUND, error: "Library not found" });
              return ResponseHandler.sendSuccessResponse({ res, code: HTTP_CODES.OK, message: "Library deleted" });
            } catch (error: any) {
              logger.error(`Error in deleteLibrary: ${error.message}`);
              return ResponseHandler.sendErrorResponse({ res, code: HTTP_CODES.INTERNAL_SERVER_ERROR, error: "Internal server error" });
            }
          }
}


export default new LibraryController();
