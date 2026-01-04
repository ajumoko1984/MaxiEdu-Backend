import Joi from "joi";
import { NextFunction, Response } from "express";
import { ExpressRequest } from "../../app";
import ResponseHandler from "../../utils/response-handler";
import { HTTP_CODES } from "../../config/constants";
import { WEEKDAYS } from "../../enums/role.enum";




export function validateCreateTimetable(req: ExpressRequest, res: Response, next: NextFunction) {
  const schema = Joi.object().keys({
    day: Joi.string().required().valid(...Object.values(WEEKDAYS)),
    startTime: Joi.string().required().pattern(/^([01]\d|2[0-3]):([0-5]\d)$/), // HH:mm format
    endTime: Joi.string().required().pattern(/^([01]\d|2[0-3]):([0-5]\d)$/), 
    subject: Joi.string().required().min(2).max(100),
    teacher: Joi.string().optional().max(100),
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
