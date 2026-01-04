import Joi from "joi";
import { NextFunction, Response } from "express";
import { ExpressRequest } from "../../app";
import ResponseHandler from "../../utils/response-handler";
import { HTTP_CODES } from "../../config/constants";



export function validateCreateSession(req: ExpressRequest, res: Response, next: NextFunction) {
  const schema = Joi.object().keys({
    sessionName: Joi.string().required().min(2).max(100),
    startDate: Joi.date().optional(),
    endDate: Joi.date().optional(),
    isOpen: Joi.boolean().optional(),
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

export function validateCreateExam(req: ExpressRequest, res: Response, next: NextFunction) {
  const schema = Joi.object().keys({
    name: Joi.string().required().min(2).max(100),
    sessionId: Joi.string().optional(),
    description: Joi.string().optional(),
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