import Joi from "joi";
import { NextFunction, Response } from "express";
import { ExpressRequest } from "../app";
import ResponseHandler from "../utils/response-handler";
import { HTTP_CODES } from "../config/constants";

export function validateAddTeacher(req: ExpressRequest, res: Response, next: NextFunction) {
  const schema = Joi.object().keys({
    title: Joi.string().optional(),
    firstName: Joi.string().required().min(2).max(100),
    otherNames: Joi.string().optional().min(0).max(100),
    lastName: Joi.string().required().min(2).max(100),
    email: Joi.string().email().required(),
    phoneNumber: Joi.string().required().min(10).max(15),
    subjects: Joi.array().required(),
    qualifications: Joi.string().optional(),
    dateOfBirth: Joi.date().optional(),
    gender: Joi.string().valid("Male", "Female", "Other").optional(),
    address: Joi.string().optional(),
    dateEmployed: Joi.date().optional(),
    employmentType: Joi.string().valid("Full-time", "Part-time", "Contract").optional(),
    maritalStatus: Joi.string().optional(),
    nationality: Joi.string().optional(),
    stateOfOrigin: Joi.string().optional(),
    lga: Joi.string().optional(),
    religion: Joi.string().optional(),
    rfid: Joi.string().optional(),
    bankAccNumber: Joi.string().optional(),
    bankAccName: Joi.string().optional(),
    bankName: Joi.string().optional(),
    faceDescriptor: Joi.array().items(Joi.number()).optional(),
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
    otherNames: Joi.string().optional().min(0).max(100),
    lastName: Joi.string().required().min(2).max(100),
    parentName: Joi.string().required().min(2).max(100),
    parentPhone: Joi.string().required().min(10).max(15),
    parentId: Joi.string().required(),
    studentId: Joi.string().required(),
    dateOfBirth: Joi.date().optional(),
    gender: Joi.string().valid("Male", "Female", "Other").optional(),
    placeOfBirth: Joi.string().optional(),
    rfid: Joi.string().optional(),
    faceDescriptor: Joi.array().items(Joi.number()).optional(),
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

export function validateCreateClass(req: ExpressRequest, res: Response, next: NextFunction) {
  const schema = Joi.object().keys({
    className: Joi.string().required().min(2).max(100),
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

export function validateAddSubject(req: ExpressRequest, res: Response, next: NextFunction) {
  const schema = Joi.object().keys({
    name: Joi.string().required().min(2).max(100),
    code: Joi.string().required(),
    classId: Joi.string().optional(),
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
    vehicleCapacity: Joi.number().optional().min(1),
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

export function validateCreateSession(req: ExpressRequest, res: Response, next: NextFunction) {
  const schema = Joi.object().keys({
    sessionName: Joi.string().required().min(2).max(100),
    startDate: Joi.date().optional(),
    endDate: Joi.date().optional(),
    isOpen: Joi.boolean().optional(),
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

export function validateCreateExam(req: ExpressRequest, res: Response, next: NextFunction) {
  const schema = Joi.object().keys({
    name: Joi.string().required().min(2).max(100),
    sessionId: Joi.string().optional(),
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

import { ROLE } from "../enums/role.enum";

export function validateMarkAttendance(req: ExpressRequest, res: Response, next: NextFunction) {
  const schema = Joi.object().keys({
    userId: Joi.string().uuid().required(),
    userType: Joi.string().valid(...Object.values(ROLE)).required(),
    date: Joi.date().required(),
    status: Joi.string().valid("present", "absent", "late", "excused").required(),
    checkInTime: Joi.string().optional(),
    checkOutTime: Joi.string().optional(),
    method: Joi.string().optional(),
    markedBy: Joi.string().optional(),
    remarks: Joi.string().optional(),
    confidenceScore: Joi.number().optional(),
  }).unknown();

  const validation = schema.validate(req.body);
  if (validation.error) {
    const error = validation.error.message || validation.error.details[0].message;
    return ResponseHandler.sendErrorResponse({ res, code: HTTP_CODES.BAD_REQUEST, error });
  }
  return next();
}

export function validateAddMaterial(req: ExpressRequest, res: Response, next: NextFunction) {
  const schema = Joi.object().keys({
    title: Joi.string().required().min(2).max(200),
    description: Joi.string().optional(),
    fileUrl: Joi.string().uri().optional(),
    fileType: Joi.string().optional(),
    uploadedBy: Joi.string().optional(),
  }).unknown();

  const validation = schema.validate(req.body);
  if (validation.error) {
    const error = validation.error.message || validation.error.details[0].message;
    return ResponseHandler.sendErrorResponse({ res, code: HTTP_CODES.BAD_REQUEST, error });
  }
  return next();
}

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

export function validateAddGrade(req: ExpressRequest, res: Response, next: NextFunction) {
  const schema = Joi.object().keys({
    grade: Joi.string().required(),
    min: Joi.number().required(),
    max: Joi.number().required(),
    description: Joi.string().optional(),
  }).unknown();

  const validation = schema.validate(req.body);
  if (validation.error) {
    const error = validation.error.message || validation.error.details[0].message;
    return ResponseHandler.sendErrorResponse({ res, code: HTTP_CODES.BAD_REQUEST, error });
  }
  return next();
}

export function validateCreateSetting(req: ExpressRequest, res: Response, next: NextFunction) {
  const schema = Joi.object().keys({
    settingKey: Joi.string().required(),
    value: Joi.string().optional(),
    themeColor: Joi.string().optional(),
  }).unknown();

  const validation = schema.validate(req.body);
  if (validation.error) {
    const error = validation.error.message || validation.error.details[0].message;
    return ResponseHandler.sendErrorResponse({ res, code: HTTP_CODES.BAD_REQUEST, error });
  }
  return next();
}

export function validateAddAlumni(req: ExpressRequest, res: Response, next: NextFunction) {
  const schema = Joi.object().keys({
    fullName: Joi.string().required().min(2).max(200),
    yearGraduated: Joi.string().optional(),
    currentOccupation: Joi.string().optional(),
    contact: Joi.string().optional(),
  }).unknown();

  const validation = schema.validate(req.body);
  if (validation.error) {
    const error = validation.error.message || validation.error.details[0].message;
    return ResponseHandler.sendErrorResponse({ res, code: HTTP_CODES.BAD_REQUEST, error });
  }
  return next();
}

// Validate :schoolId route param is UUID
export function validateSchoolId(req: ExpressRequest, res: Response, next: NextFunction) {
  const schema = Joi.object().keys({
    schoolId: Joi.string().uuid().required(),
  });

  const validation = schema.validate(req.params);
  if (validation.error) {
    const error = validation.error.message || validation.error.details[0].message;
    return ResponseHandler.sendErrorResponse({ res, code: HTTP_CODES.BAD_REQUEST, error });
  }
  return next();
}

// Factory to validate arbitrary param as UUID (e.g., id, studentId)
export function validateIdParam(paramName: string) {
  return function (req: ExpressRequest, res: Response, next: NextFunction) {
    const schema = Joi.object().keys({
      [paramName]: Joi.string().uuid().required(),
    });

    const validation = schema.validate(req.params);
    if (validation.error) {
      const error = validation.error.message || validation.error.details[0].message;
      return ResponseHandler.sendErrorResponse({ res, code: HTTP_CODES.BAD_REQUEST, error });
    }
    return next();
  };
}

