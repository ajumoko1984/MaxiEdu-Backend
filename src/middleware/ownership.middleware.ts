import { NextFunction, Response } from "express";
import ResponseHandler from "../utils/response-handler";
import { HTTP_CODES } from "../config/constants";
import { ExpressRequest } from "../app";
import schoolRepository from "../repository/school.repository";

// Ensure :schoolId exists and attach school to req.school
export async function ensureSchoolExists(req: ExpressRequest, res: Response, next: NextFunction) {
  try {
    const schoolId = req.params.schoolId;
    const school = await schoolRepository.findOne({ id: schoolId });
    if (!school) {
      return ResponseHandler.sendErrorResponse({ res, code: HTTP_CODES.NOT_FOUND, error: "School not found" });
    }
    // attach for downstream handlers
    (req as any).school = school;
    return next();
  } catch (error: any) {
    return ResponseHandler.sendErrorResponse({ res, code: HTTP_CODES.INTERNAL_SERVER_ERROR, error: "Internal server error" });
  }
}

// Factory: ensure resource belongs to the school
export function ensureResourceBelongsToSchool(repo: any, paramName = "id", resourceSchoolField = "schoolId") {
  return async function (req: ExpressRequest, res: Response, next: NextFunction) {
    try {
        const id = req.params[paramName];
        const resource = await repo.findOne({ id });
        if (!resource) {
            return ResponseHandler.sendErrorResponse({ res, code: HTTP_CODES.NOT_FOUND, error: "Resource not found" });
        }
        const schoolId = req.params.schoolId;
        if (resource[resourceSchoolField] !== schoolId) {
          return ResponseHandler.sendErrorResponse({ res, code: HTTP_CODES.FORBIDDEN, error: "Resource does not belong to the specified school" });
        }
      // attach for downstream handlers if needed
      (req as any).resource = resource;
      return next();
    } catch (error: any) {
      return ResponseHandler.sendErrorResponse({ res, code: HTTP_CODES.INTERNAL_SERVER_ERROR, error: "Internal server error" });
    }
  };
}
