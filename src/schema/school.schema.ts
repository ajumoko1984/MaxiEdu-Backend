import { NextFunction, Response } from "express";
import Joi from "joi";
import { ExpressRequest } from "../app";
import ResponseHandler from "../utils/response-handler";
import { HTTP_CODES } from "../config/constants";

export function validateCreateSchool(
  req: ExpressRequest,
  res: Response,
  next: NextFunction
) {
  const schema = Joi.object()
    .keys({
      name: Joi.string().min(2).max(255).required(),
      address: Joi.string().max(500).optional(),
      phoneNumber: Joi.string()
        .regex(/^\+?[\d\s\-()]{10,15}$/)
        .optional(),
      email: Joi.string().email().optional(),
      website: Joi.string().uri().optional(),
      principalName: Joi.string().max(255).optional(),
      description: Joi.string().max(2000).optional(),
      registrationNumber: Joi.string().max(100).optional(),
      state: Joi.string().max(100).optional(),
      city: Joi.string().max(100).optional(),
    })
    .unknown();

  const validation = schema.validate(req.body);

  if (validation.error) {
    const error = validation.error.message
      ? validation.error.message
      : validation.error.details[0].message;

    return ResponseHandler.sendErrorResponse({
      res,
      code: HTTP_CODES.BAD_REQUEST,
      error,
    });
  }

  return next();
}

export function validateUpdateSchool(
  req: ExpressRequest,
  res: Response,
  next: NextFunction
) {
  const schema = Joi.object()
    .keys({
      name: Joi.string().min(2).max(255).optional(),
      address: Joi.string().max(500).optional(),
      phoneNumber: Joi.string()
        .regex(/^\+?[\d\s\-()]{10,15}$/)
        .optional(),
      email: Joi.string().email().optional(),
      website: Joi.string().uri().optional(),
      principalName: Joi.string().max(255).optional(),
      description: Joi.string().max(2000).optional(),
      registrationNumber: Joi.string().max(100).optional(),
      state: Joi.string().max(100).optional(),
      city: Joi.string().max(100).optional(),
      isActive: Joi.boolean().optional(),
      isDisabled: Joi.boolean().optional(),
    })
    .unknown();

  const validation = schema.validate(req.body);

  if (validation.error) {
    const error = validation.error.message
      ? validation.error.message
      : validation.error.details[0].message;

    return ResponseHandler.sendErrorResponse({
      res,
      code: HTTP_CODES.BAD_REQUEST,
      error,
    });
  }

  return next();
}
