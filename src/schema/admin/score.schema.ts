import Joi from "joi";
import { NextFunction, Response } from "express";
import { ExpressRequest } from "../../app";
import ResponseHandler from "../../utils/response-handler";
import { HTTP_CODES } from "../../config/constants";



export function validateAddScore(req: ExpressRequest, res: Response, next: NextFunction) {
  const schema = Joi.object().keys({
    subjectId: Joi.string().required(),
    studentId: Joi.string().required(),
    classId: Joi.string().optional(),
    examId: Joi.string().optional(),
    sessionId: Joi.string().optional(),
    firstCA: Joi.number().optional(),
    secondCA: Joi.number().optional(),
    exam: Joi.number().optional(),
  }).unknown();

  const validation = schema.validate(req.body);
  if (validation.error) {
    const error = validation.error.message || validation.error.details[0].message;
    return ResponseHandler.sendErrorResponse({ res, code: HTTP_CODES.BAD_REQUEST, error });
  }
  return next();
}
