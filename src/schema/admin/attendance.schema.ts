import Joi from "joi";
import { NextFunction, Response } from "express";
import { ExpressRequest } from "../../app";
import ResponseHandler from "../../utils/response-handler";
import { HTTP_CODES } from "../../config/constants";

export enum AttendanceType {
  STUDENT = "STU",
  TEACHER = "TCH",
}

export function validateMarkAttendance(req: ExpressRequest, res: Response, next: NextFunction) {
  const schema = Joi.object().keys({
    personId: Joi.string().uuid().required(), 
    attenderId: Joi.string().uuid().required(),
    type: Joi.string().valid(...Object.values(AttendanceType)).required(),
    checkInTime: Joi.date().iso().required(),
    checkOutTime: Joi.date().iso().optional(),
    faceRecognitionScore: Joi.number().min(0).max(1).optional(), 
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
