import Joi from "joi";
import { NextFunction, Response } from "express";
import { ExpressRequest } from "../../app";
import ResponseHandler from "../../utils/response-handler";
import { HTTP_CODES } from "../../config/constants";




export function validateAddSubject(req: ExpressRequest, res: Response, next: NextFunction) {
  const schema = Joi.object().keys({
    name: Joi.string().required().min(2).max(100),
    code: Joi.string().required(),
    classId: Joi.string().optional(),
    teacherId: Joi.string().optional(),
    credits: Joi.number().optional().min(0).max(10),
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