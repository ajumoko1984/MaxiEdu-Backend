import Joi from "joi";
import { NextFunction, Response } from "express";
import { ExpressRequest } from "../../app";
import ResponseHandler from "../../utils/response-handler";
import { HTTP_CODES } from "../../config/constants";




export function validateAddDorm(req: ExpressRequest, res: Response, next: NextFunction) {
  const schema = Joi.object().keys({
    dormName: Joi.string().required().min(2).max(100),
    dormCode: Joi.string().required(),
    capacity: Joi.number().integer().required().min(1),
    gender: Joi.string().valid("Boys", "Girls", "Mixed").required(),
    wardensName: Joi.string().required(),
    wardensPhone: Joi.string().required().min(10).max(15),
    groundFloor: Joi.number().integer().optional().min(0),
    firstFloor: Joi.number().integer().optional().min(0),
    secondFloor: Joi.number().integer().optional().min(0),
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