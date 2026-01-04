import Joi from "joi";
import { NextFunction, Response } from "express";
import { ExpressRequest } from "../app";
import ResponseHandler from "../utils/response-handler";
import { HTTP_CODES } from "../config/constants";
import { AVAILABILITY, ROLE, WEEKDAYS } from "../enums/role.enum";




export function validateAddTransportRoute(req: ExpressRequest, res: Response, next: NextFunction) {
  const schema = Joi.object().keys({
    routeName: Joi.string().required().min(2).max(100),
    routeCode: Joi.string().required(),
    driverName: Joi.string().required().min(2).max(100),
    driverPhone: Joi.string().required().min(10).max(15),
    vehicleRegistration: Joi.string().required(),
    vehicleCapacity: Joi.number().optional().min(1),
    pickupLocations: Joi.array().items(Joi.string()).optional(),
    dropLocations: Joi.array().items(Joi.string()).optional(),
    departureTime: Joi.string().optional(),
    returnTime: Joi.string().optional(),
    costPerTrip: Joi.number().optional().min(0),
    costPerMonth: Joi.number().optional().min(0),
  }).unknown();

  const validation = schema.validate(req.body);
  if (validation.error) {
    const error = validation.error.message || validation.error.details[0].message;
    return ResponseHandler.sendErrorResponse({
      res,
      code: HTTP_CODES.BAD_REQUEST,
      error,
    });
  }
  return next();
}





export function validateMarkAttendance(req: ExpressRequest, res: Response, next: NextFunction) {
  const schema = Joi.object().keys({
    userId: Joi.string().uuid().required(),
    userType: Joi.string().valid(...Object.values(ROLE)).required(),
    date: Joi.date().required(),
    status: Joi.string().valid("present", "absent", "late", "excused").required(),
    checkInTime: Joi.string().optional(),
    checkOutTime: Joi.string().optional(),
    method: Joi.string().optional(),
    markedBy: Joi.string().optional(),
    remarks: Joi.string().optional(),
    confidenceScore: Joi.number().optional(),
  }).unknown();

  const validation = schema.validate(req.body);
  if (validation.error) {
    const error = validation.error.message || validation.error.details[0].message;
    return ResponseHandler.sendErrorResponse({ res, code: HTTP_CODES.BAD_REQUEST, error });
  }
  return next();
}

export function validateAddMaterial(req: ExpressRequest, res: Response, next: NextFunction) {
  const schema = Joi.object().keys({
    title: Joi.string().required().min(2).max(200),
    description: Joi.string().optional(),
    fileUrl: Joi.string().uri().optional(),
    fileType: Joi.string().optional(),
    uploadedBy: Joi.string().optional(),
  }).unknown();

  const validation = schema.validate(req.body);
  if (validation.error) {
    const error = validation.error.message || validation.error.details[0].message;
    return ResponseHandler.sendErrorResponse({ res, code: HTTP_CODES.BAD_REQUEST, error });
  }
  return next();
}



export function validateCreateSetting(req: ExpressRequest, res: Response, next: NextFunction) {
  const schema = Joi.object().keys({
    settingKey: Joi.string().required(),
    value: Joi.string().optional(),
    themeColor: Joi.string().optional(),
  }).unknown();

  const validation = schema.validate(req.body);
  if (validation.error) {
    const error = validation.error.message || validation.error.details[0].message;
    return ResponseHandler.sendErrorResponse({ res, code: HTTP_CODES.BAD_REQUEST, error });
  }
  return next();
}

// Validate :schoolId route param is UUID
export function validateSchoolId(req: ExpressRequest, res: Response, next: NextFunction) {
  const schema = Joi.object().keys({
    schoolId: Joi.string().uuid().required(),
  });

  const validation = schema.validate(req.params);
  if (validation.error) {
    const error = validation.error.message || validation.error.details[0].message;
    return ResponseHandler.sendErrorResponse({ res, code: HTTP_CODES.BAD_REQUEST, error });
  }
  return next();
}

// Factory to validate arbitrary param as UUID (e.g., id, studentId)
export function validateIdParam(paramName: string) {
  return function (req: ExpressRequest, res: Response, next: NextFunction) {
    const schema = Joi.object().keys({
      [paramName]: Joi.string().uuid().required(),
    });

    const validation = schema.validate(req.params);
    if (validation.error) {
      const error = validation.error.message || validation.error.details[0].message;
      return ResponseHandler.sendErrorResponse({ res, code: HTTP_CODES.BAD_REQUEST, error });
    }
    return next();
  };
}

