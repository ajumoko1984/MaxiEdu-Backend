import Joi from "joi";
import { NextFunction, Response } from "express";
import { ExpressRequest } from "../../app";
import ResponseHandler from "../../utils/response-handler";
import { HTTP_CODES } from "../../config/constants";

export function validateAddTeacher(
  req: ExpressRequest,
  res: Response,
  next: NextFunction
) {
  const schema = Joi.object({
    title: Joi.string().optional(),
    firstName: Joi.string().required().min(2).max(100),
    otherNames: Joi.string().optional().max(100),
    lastName: Joi.string().required().min(2).max(100),
    email: Joi.string().email().required(),
    phoneNumber: Joi.string().required().min(10).max(15),
    subjects: Joi.array().items(Joi.string()).required(),
        profileImageBase64: Joi.string().optional(),
    profileImageMimeType: Joi.string().optional(),
    passportBase64: Joi.string().optional(),
passportMimeType: Joi.string().optional(),

qualifications: Joi.string().optional(),
    dateOfBirth: Joi.date().optional(),
    gender: Joi.string().valid("Male", "Female", "Other").optional(),
    address: Joi.string().optional(),
    dateEmployed: Joi.date().optional(),
    employmentType: Joi.string()
      .valid("Full-time", "Part-time", "Contract")
      .optional(),
    maritalStatus: Joi.string().optional(),
    nationality: Joi.string().optional(),
    stateOfOrigin: Joi.string().optional(),
    lga: Joi.string().optional(),
    religion: Joi.string().optional(),
    rfid: Joi.string().optional(),
    bankName: Joi.string().optional(),
    bankAccountNumber: Joi.number().optional(),
    bankAccountName: Joi.string().optional(),

    faceDescriptor: Joi.array().items(Joi.number()).optional(),
  }).unknown();

  const { error } = schema.validate(req.body);
  if (error) {
    return ResponseHandler.sendErrorResponse({
      res,
      code: HTTP_CODES.BAD_REQUEST,
      error: error.message,
    });
  }

  next();
}
