import Joi from "joi";
import { NextFunction, Response } from "express";
import { ExpressRequest } from "../app";
import ResponseHandler from "../utils/response-handler";
import { HTTP_CODES } from "../config/constants";

export function validateAddTeacher(req: ExpressRequest, res: Response, next: NextFunction) {
  const schema = Joi.object().keys({
    firstName: Joi.string().required().min(2).max(100),
    lastName: Joi.string().required().min(2).max(100),
    email: Joi.string().email().required(),
    phoneNumber: Joi.string().required().min(10).max(15),
    subjects: Joi.array().required(),
    qualifications: Joi.string().optional(),
    dateOfBirth: Joi.date().optional(),
    gender: Joi.string().valid("Male", "Female", "Other").optional(),
    address: Joi.string().optional(),
    employmentDate: Joi.date().required(),
    contractType: Joi.string().valid("Permanent", "Contract", "Temporary").optional(),
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

export function validateAddStudent(req: ExpressRequest, res: Response, next: NextFunction) {
  const schema = Joi.object().keys({
    firstName: Joi.string().required().min(2).max(100),
    lastName: Joi.string().required().min(2).max(100),
    email: Joi.string().email().optional(),
    phone: Joi.string().optional().min(10).max(15),
    admissionNumber: Joi.string().required(),
    classId: Joi.string().required(),
    dateOfBirth: Joi.date().optional(),
    gender: Joi.string().valid("Male", "Female", "Other").optional(),
    fatherName: Joi.string().optional(),
    fatherPhone: Joi.string().optional().min(10).max(15),
    motherName: Joi.string().optional(),
    motherPhone: Joi.string().optional().min(10).max(15),
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

export function validateCreateClass(req: ExpressRequest, res: Response, next: NextFunction) {
  const schema = Joi.object().keys({
    className: Joi.string().required().min(2).max(100),
    classCode: Joi.string().required(),
    form: Joi.string().required(),
    stream: Joi.string().optional(),
    classTeacherId: Joi.string().required(),
    capacity: Joi.number().integer().min(1).optional(),
    roomNumber: Joi.string().optional(),
    academicYear: Joi.string().required(),
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

export function validateAddSubject(req: ExpressRequest, res: Response, next: NextFunction) {
  const schema = Joi.object().keys({
    subjectName: Joi.string().required().min(2).max(100),
    subjectCode: Joi.string().required(),
    form: Joi.string().required(),
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

export function validateAddTransportRoute(req: ExpressRequest, res: Response, next: NextFunction) {
  const schema = Joi.object().keys({
    routeName: Joi.string().required().min(2).max(100),
    routeCode: Joi.string().required(),
    driverName: Joi.string().required().min(2).max(100),
    driverPhone: Joi.string().required().min(10).max(15),
    vehicleRegistration: Joi.string().required(),
    vehicleCapacity: Joi.number().integer().required().min(1),
    pickupLocations: Joi.array().items(Joi.string()).optional(),
    dropLocations: Joi.array().items(Joi.string()).optional(),
    departureTime: Joi.string().optional(),
    returnTime: Joi.string().optional(),
    costPerTrip: Joi.number().optional().min(0),
    costPerMonth: Joi.number().optional().min(0),
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
