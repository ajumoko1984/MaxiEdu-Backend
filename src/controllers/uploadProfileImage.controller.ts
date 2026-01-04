import { Response } from "express";
import { ExpressRequest } from "../app";
import ResponseHandler from "../utils/response-handler";
import { HTTP_CODES } from "../config/constants";
import teacherRepository from "../repository/teacher.repository";
import studentRepository from "../repository/student.repository";
import usersRepository from "../repository/users.repository";

const allowedEntities = ["teacher", "student", "staff", "user"];


export async function uploadProfileImage(req: ExpressRequest, res: Response) {
  const { entityType, entityId, imageType } = req.params;
  const { imageBase64, imageMimeType } = req.body;

  if (!["profile", "passport"].includes(imageType)) {
    return ResponseHandler.sendErrorResponse({
      res,
      code: HTTP_CODES.BAD_REQUEST,
      error: "Invalid image type",
    });
  }

  if (!allowedEntities.includes(entityType)) {
    return ResponseHandler.sendErrorResponse({
      res,
      code: HTTP_CODES.BAD_REQUEST,
      error: "Invalid entity type",
    });
  }

  if (!imageBase64 || !imageMimeType) {
    return ResponseHandler.sendErrorResponse({
      res,
      code: HTTP_CODES.BAD_REQUEST,
      error: "Image data is required",
    });
  }

  if (imageBase64.length > 2_000_000) {
    return ResponseHandler.sendErrorResponse({
      res,
      code: HTTP_CODES.BAD_REQUEST,
      error: "Image too large",
    });
  }

  // Dynamically update correct field
  const updateData: any = {};
  if (imageType === "profile") {
    updateData.profileImageBase64 = imageBase64;
    updateData.profileImageMimeType = imageMimeType;
  } else if (imageType === "passport") {
    updateData.passportBase64 = imageBase64;
    updateData.passportMimeType = imageMimeType;
  }

  let entity: any = null;
  switch (entityType) {
    case "teacher":
      entity = await teacherRepository.atomicUpdate({ id: entityId }, updateData);
      break;
    case "student":
      entity = await studentRepository.atomicUpdate({ id: entityId }, updateData);
      break;
    case "user":
      entity = await usersRepository.atomicUpdate({ id: entityId }, updateData);
      break;
  }

    if (!entity) {
    return ResponseHandler.sendErrorResponse({
      res,
      code: HTTP_CODES.NOT_FOUND,
      error: "Entity not found",
    });
  }


  return ResponseHandler.sendSuccessResponse({
    res,
    code: HTTP_CODES.OK,
    message: `${imageType} uploaded successfully`,
    data: { entityId, entityType, imageType },
  });
}

export async function getProfileImage(req: ExpressRequest, res: Response) {
  const { entityType, entityId, imageType } = req.params;

  if (!["profile", "passport"].includes(imageType)) {
    return ResponseHandler.sendErrorResponse({
      res,
      code: HTTP_CODES.BAD_REQUEST,
      error: "Invalid image type",
    });
  }

  if (!allowedEntities.includes(entityType)) {
    return ResponseHandler.sendErrorResponse({
      res,
      code: HTTP_CODES.BAD_REQUEST,
      error: "Invalid entity type",
    });
  }

  let entity: any = null;
  switch (entityType) {
    case "teacher":
      entity = await teacherRepository.findProfileImageById(entityId);
      break;
    case "student":
      entity = await studentRepository.findProfileImageById(entityId);
      break;
    case "user":
      entity = await usersRepository.findProfileImageById(entityId);
      break;
  }

  if (!entity) {
    return ResponseHandler.sendErrorResponse({
      res,
      code: HTTP_CODES.NOT_FOUND,
      error: "Entity not found",
    });
  }


      const base64Field =
  imageType === "profile"
    ? entity.profileImageBase64
    : entity.passportBase64;

const mimeTypeField =
  imageType === "profile"
    ? entity.profileImageMimeType
    : entity.passportMimeType;


  if (!base64Field || !mimeTypeField) {
    return ResponseHandler.sendErrorResponse({
      res,
      code: HTTP_CODES.NOT_FOUND,
      error: `${imageType} image not found`,
    });
  }

  return ResponseHandler.sendSuccessResponse({
    res,
    code: HTTP_CODES.OK,
    data: {
      imageBase64: base64Field,
      imageMimeType: mimeTypeField,
    },
  });
}
