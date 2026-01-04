import Joi from "joi";
import { NextFunction, Response } from "express";
import { ExpressRequest } from "../../app";
import ResponseHandler from "../../utils/response-handler";
import { HTTP_CODES } from "../../config/constants";
import { AVAILABILITY } from "../../enums/role.enum";



export function validateCreateLibrary(req: ExpressRequest, res: Response, next: NextFunction) {
  const schema = Joi.object().keys({
    bookName: Joi.string().required().min(2).max(100),
    quantity: Joi.number().required(),
    available: Joi.string().valid(...Object.values(AVAILABILITY)).required(),
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
