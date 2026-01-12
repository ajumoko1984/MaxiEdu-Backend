import Joi from "joi";
import { NextFunction, Response } from "express";
import { ExpressRequest } from "../../app";
import ResponseHandler from "../../utils/response-handler";
import { HTTP_CODES } from "../../config/constants";


export function validateFaceVerify(req: ExpressRequest, res: Response, next: NextFunction) {
  const schema = Joi.object().keys({
    liveFaceDescriptor: Joi.array()
    .items(Joi.number().precision(10))
    .length(128)
    .required(),

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
export function validateFaceEnroll(req: ExpressRequest, res: Response, next: NextFunction) {
  const schema = Joi.object().keys({
      faceDescriptor: Joi.array()
    .items(Joi.number().precision(10))
    .length(128)
    .required(),

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
