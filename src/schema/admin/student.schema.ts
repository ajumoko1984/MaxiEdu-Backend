import Joi from "joi";
import { NextFunction, Response } from "express";
import { ExpressRequest } from "../../app";
import ResponseHandler from "../../utils/response-handler";
import { HTTP_CODES } from "../../config/constants";


export function validateAddStudent(req: ExpressRequest, res: Response, next: NextFunction) {
  const schema = Joi.object().keys({
    firstName: Joi.string().required().min(2).max(100),
    otherNames: Joi.string().optional().min(0).max(100),
    lastName: Joi.string().required().min(2).max(100),
    parentName: Joi.string().required().min(2).max(100),
    parentPhone: Joi.string().required().min(10).max(15),
    parentId: Joi.string().required(),
            profileImageBase64: Joi.string().optional(),
        profileImageMimeType: Joi.string().optional(),
        passportBase64: Joi.string().optional(),
passportMimeType: Joi.string().optional(),

    studentId: Joi.string().required(),
    dateOfBirth: Joi.date().optional(),
    gender: Joi.string().valid("Male", "Female", "Other").optional(),
    placeOfBirth: Joi.string().optional(),
  rfidUid: Joi.string()
  .pattern(/^[A-Fa-f0-9]+$/)
  .min(8)
  .max(32),

    faceDescriptor: Joi.array()
  .items(Joi.number().precision(10))
  .length(128)
  .required(),
    nationality: Joi.string().optional(),
    stateOfOrigin: Joi.string().optional(),
    lga: Joi.string().optional(),
    religion: Joi.string().optional(),
    bloodGroup: Joi.string().optional(),
    genotype: Joi.string().optional(),
    previousSchool: Joi.string().optional(),
    status: Joi.string().valid("Active", "Graduated", "Withdrawn").optional(),
    knownMedicalConditions: Joi.string().optional(),
    allergies: Joi.string().optional(),
    specialNeeds: Joi.string().optional(),
    emergencyContactName: Joi.string().optional(),
    emergencyContactPhone: Joi.string().optional().min(10).max(15),
    address: Joi.string().optional(),
    admissionDate: Joi.date().required(),
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



export function validateFaceVerify(req: ExpressRequest, res: Response, next: NextFunction) {
  const schema = Joi.object().keys({
 rfidUid: Joi.string()
  .pattern(/^[A-Fa-f0-9]+$/)
  .min(8)
  .max(32)
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