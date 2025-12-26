import { NextFunction, Response } from "express";
import Joi from "joi";
import { ExpressRequest } from "../app";
import ResponseHandler from "../utils/response-handler";
import { HTTP_CODES } from "../config/constants";

export function validateUserSignup(
  req: ExpressRequest,
  res: Response,
  next: NextFunction
) {
  const schema = Joi.object()
    .keys({
      firstName: Joi.string().lowercase().required(),
      lastName: Joi.string().lowercase().required(),
      email: Joi.string().email().required(),
      role: Joi.string().lowercase().required(),
      password: Joi.string().min(6).max(128).required(),
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

export function validateUserLogin(
  req: ExpressRequest,
  res: Response,
  next: NextFunction
) {
  const schema = Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  });

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


export function validateForgotPassword(
  req: ExpressRequest,
  res: Response,
  next: NextFunction
) {
  const schema = Joi.object().keys({
    email: Joi.string().email().required(),
  });

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

export function validateResetPasswordToken(
  req: ExpressRequest,
  res: Response,
  next: NextFunction
) {
  const schema = Joi.object().keys({
    token: Joi.string().required(),
    password: Joi.string().min(6).max(128).required(),
  });

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

export function validateProfileUpdate(
  req: ExpressRequest,
  res: Response,
  next: NextFunction
) {
  const schema = Joi.object()
    .keys({
      firstName: Joi.string().lowercase().optional(),
      lastName: Joi.string().lowercase().optional(),
      phoneNumber: Joi.any().optional(),
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


export function validateSchoolAdminSignup(
  req: ExpressRequest,
  res: Response,
  next: NextFunction
) {
  const schema = Joi.object()
    .keys({
      firstName: Joi.string().lowercase().required(),
      lastName: Joi.string().lowercase().required(),
      email: Joi.string().email().required(),
      password: Joi.string().min(6).max(128).required(),
     schoolId: Joi.string().uuid().optional(),
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
export function validateSchoolAdminLogin(
  req: ExpressRequest,
  res: Response,
  next: NextFunction
) {
  const schema = Joi.object()
  .keys({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
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

export function validateAdminApproval(
  req: ExpressRequest,
  res: Response,
  next: NextFunction
) {
  const schema = Joi.object().keys({
    email: Joi.string().email().required(),
  });
  
  const validation = schema.validate(req.body);
  if (validation.error) {
    return ResponseHandler.sendErrorResponse({
      res,
      code: HTTP_CODES.BAD_REQUEST,
      error: validation.error.message,
    });
  }
  next();
}


