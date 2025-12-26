import { Response } from "express";
import schoolRepository from "../repository/school.repository";
import ResponseHandler from "../utils/response-handler";
import { HTTP_CODES } from "../config/constants";
import Logger from "../utils/logger";
import { ExpressRequest } from "../app";

const logger = new Logger("School Controller");

class SchoolController {
  // Create a new school
  async createSchool(req: ExpressRequest, res: Response) {
    try {
      const {
        name,
        address,
        phoneNumber,
        email,
        website,
        principalName,
        description,
        registrationNumber,
        state,
        city,
      } = req.body;

      // Check if school with same name already exists
      const existingSchool = await schoolRepository.findOne({ name });
      if (existingSchool) {
        return ResponseHandler.sendErrorResponse({
          res,
          code: HTTP_CODES.CONFLICT,
          error: "School with this name already exists",
        });
      }

      const school = await schoolRepository.create({
        name,
        address,
        phoneNumber,
        email,
        website,
        principalName,
        description,
        registrationNumber,
        state,
        city,
      });

      return ResponseHandler.sendSuccessResponse({
        res,
        code: HTTP_CODES.CREATED,
        message: "School created successfully",
        data: school,
      });
    } catch (error: any) {
      logger.error(`Error in createSchool: ${error.message}`);
      return ResponseHandler.sendErrorResponse({
        res,
        code: HTTP_CODES.INTERNAL_SERVER_ERROR,
        error: "Internal server error",
      });
    }
  }

  // Get all schools
  async getAllSchools(req: ExpressRequest, res: Response) {
    try {
      const schools = await schoolRepository.findAll(req.query);

      return ResponseHandler.sendSuccessResponse({
        res,
        code: HTTP_CODES.OK,
        message: "Schools retrieved successfully",
        data: schools,
      });
    } catch (error: any) {
      logger.error(`Error in getAllSchools: ${error.message}`);
      return ResponseHandler.sendErrorResponse({
        res,
        code: HTTP_CODES.INTERNAL_SERVER_ERROR,
        error: "Internal server error",
      });
    }
  }

  // Get a single school by ID
  async getSchoolById(req: ExpressRequest, res: Response) {
    try {
      const { id } = req.params;

      const school = await schoolRepository.findOne({ id });

      if (!school) {
        return ResponseHandler.sendErrorResponse({
          res,
          code: HTTP_CODES.NOT_FOUND,
          error: "School not found",
        });
      }

      return ResponseHandler.sendSuccessResponse({
        res,
        code: HTTP_CODES.OK,
        message: "School retrieved successfully",
        data: school,
      });
    } catch (error: any) {
      logger.error(`Error in getSchoolById: ${error.message}`);
      return ResponseHandler.sendErrorResponse({
        res,
        code: HTTP_CODES.INTERNAL_SERVER_ERROR,
        error: "Internal server error",
      });
    }
  }

  // Update a school
  async updateSchool(req: ExpressRequest, res: Response) {
    try {
      const { id } = req.params;
      const allowed: any = {};

      // Only allow specific fields to be updated
      const allowedFields = [
        "name",
        "address",
        "phoneNumber",
        "email",
        "website",
        "principalName",
        "description",
        "registrationNumber",
        "state",
        "city",
        "isActive",
        "isDisabled",
      ];

      Object.keys(req.body).forEach((key) => {
        if (allowedFields.includes(key)) {
          allowed[key] = req.body[key];
        }
      });

      const school = await schoolRepository.atomicUpdate({ id }, allowed);

      if (!school) {
        return ResponseHandler.sendErrorResponse({
          res,
          code: HTTP_CODES.NOT_FOUND,
          error: "School not found",
        });
      }

      return ResponseHandler.sendSuccessResponse({
        res,
        code: HTTP_CODES.OK,
        message: "School updated successfully",
        data: school,
      });
    } catch (error: any) {
      logger.error(`Error in updateSchool: ${error.message}`);
      return ResponseHandler.sendErrorResponse({
        res,
        code: HTTP_CODES.INTERNAL_SERVER_ERROR,
        error: "Internal server error",
      });
    }
  }

  // Delete a school (soft delete)
  async deleteSchool(req: ExpressRequest, res: Response) {
    try {
      const { id } = req.params;

      const success = await schoolRepository.deleteOne({ id });

      if (!success) {
        return ResponseHandler.sendErrorResponse({
          res,
          code: HTTP_CODES.NOT_FOUND,
          error: "School not found",
        });
      }

      return ResponseHandler.sendSuccessResponse({
        res,
        code: HTTP_CODES.OK,
        message: "School deleted successfully",
      });
    } catch (error: any) {
      logger.error(`Error in deleteSchool: ${error.message}`);
      return ResponseHandler.sendErrorResponse({
        res,
        code: HTTP_CODES.INTERNAL_SERVER_ERROR,
        error: "Internal server error",
      });
    }
  }

  // Get platform-wide statistics
  async getPlatformOverview(req: ExpressRequest, res: Response) {
    try {
      const overview = await schoolRepository.getSchoolsOverview();

      return ResponseHandler.sendSuccessResponse({
        res,
        code: HTTP_CODES.OK,
        message: "Platform overview retrieved successfully",
        data: overview,
      });
    } catch (error: any) {
      logger.error(`Error in getPlatformOverview: ${error.message}`);
      return ResponseHandler.sendErrorResponse({
        res,
        code: HTTP_CODES.INTERNAL_SERVER_ERROR,
        error: "Internal server error",
      });
    }
  }
}

export default new SchoolController();
