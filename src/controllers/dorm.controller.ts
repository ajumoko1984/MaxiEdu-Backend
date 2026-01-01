import { Response } from "express";
import ResponseHandler from "../utils/response-handler";
import { HTTP_CODES } from "../config/constants";
import Logger from "../utils/logger";
import { ExpressRequest } from "../app";
import dormRepository from "../repository/dorm.repository";
import schoolRepository from "../repository/school.repository";

const logger = new Logger("Dorm Controller");

class DormController {
   // Add dorm
  async addDorm(req: ExpressRequest, res: Response) {
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
      const { dormName, dormType, capacity, dormMasterId, rules } = req.body;

      const exists = await dormRepository.findOne({ dormName });
      if (exists) {
        return ResponseHandler.sendErrorResponse({
          res,
          code: HTTP_CODES.CONFLICT,
          error: "Dorm with this name already exists",
        });
      }

      const dorm = await dormRepository.create({
        schoolId,
        dormName,
        dormType,
        capacity,
        dormMasterId,
        rules,
      });

      return ResponseHandler.sendSuccessResponse({
        res,
        code: HTTP_CODES.CREATED,
        message: "Dorm added successfully",
        data: dorm,
      });
    } catch (error: any) {
      logger.error(`Error in addDorm: ${error.message}`);
      return ResponseHandler.sendErrorResponse({
        res,
        code: HTTP_CODES.INTERNAL_SERVER_ERROR,
        error: "Internal server error",
      });
    }
  }

}


export default new DormController();
