import Joi from "joi";
import { NextFunction, Response } from "express";
import { ExpressRequest } from "../../app";
import ResponseHandler from "../../utils/response-handler";
import { HTTP_CODES } from "../../config/constants";





export function validateAddParent(req: ExpressRequest, res: Response, next: NextFunction) {
  const schema = Joi.object().keys({
    fullName: Joi.string().required().min(2).max(200),
    relationship: Joi.string().optional(),
    email: Joi.string().email().optional(),
    phonePrimary: Joi.string().required().min(10).max(15),
    phoneAlternative: Joi.string().optional().min(10).max(15),
    homeAddress: Joi.string().optional(),
    occupation: Joi.string().optional(),
    placeOfWork: Joi.string().optional(),
    password: Joi.string().optional().min(6),
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