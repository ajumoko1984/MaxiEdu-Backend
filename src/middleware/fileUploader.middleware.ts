import multer from "multer";
import sharp from "sharp";
import { HTTP_CODES, Namespaces } from "../config/constants";
import Logger from "../utils/logger";
import { ExpressRequest } from "../app";
import { NextFunction, Response } from "express";
import ResponseHandler from "../utils/response-handler";
import LabFileModel from "../models/labFile.model";

const logger = new Logger("error", Namespaces.Entry);

const storage = multer.memoryStorage();

const allowedMimeTypes = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "application/pdf",
];
const maxFileSize = 1 * 1024 * 1024; // 1MB

export const fileUploader = (
  req: ExpressRequest,
  res: Response,
  next: NextFunction
) => {
  const upload =
    multer({
      storage,
      limits: { fileSize: maxFileSize },
      fileFilter: (req, file, cb) => {
        if (!allowedMimeTypes.includes(file.mimetype)) {
          return cb(
            new Error(
              `Invalid file type: ${
                file.mimetype
              }. Allowed: ${allowedMimeTypes.join(", ")}`
            )
          );
        }
        cb(null, true);
      },
    }).array("upload", 5) ||
    multer({
      storage,
      limits: { fileSize: maxFileSize },
      fileFilter: (req, file, cb) => {
        if (!allowedMimeTypes.includes(file.mimetype)) {
          return cb(
            new Error(
              `Invalid file type: ${
                file.mimetype
              }. Allowed: ${allowedMimeTypes.join(", ")}`
            )
          );
        }
        cb(null, true);
      },
    }).single("upload");
  upload(req, res, async (err: any) => {
    if (err) {
      logger.error("Multer error:", err);

      let errorMessage = "File upload error";
      if (err.code === "LIMIT_FILE_SIZE") {
        errorMessage = `File too large. Max size is ${
          maxFileSize / 1024 / 1024
        }MB`;
      } else if (err.message) {
        errorMessage = err.message;
      }

      return ResponseHandler.sendErrorResponse({
        res,
        code: HTTP_CODES.BAD_REQUEST,
        error: errorMessage,
      });
    }

    try {
      const uploadFiles: Express.Multer.File[] = Array.isArray(req.files)
        ? (req.files as Express.Multer.File[])
        : req.file
        ? [req.file as Express.Multer.File]
        : [];

      req.body.attachedFiles = req.body.attachedFiles || [];

      for (const file of uploadFiles) {
        let buffer = file.buffer;
        let filename = file.originalname;

        // Optimize images only (skip PDFs)
        if (file.mimetype.startsWith("image/")) {
          buffer = await sharp(buffer)
            .resize({ width: 800 })
            .webp({ quality: 60 })
            .toBuffer();

          filename = filename.replace(/\..+$/, ".webp");
        }

        const savedFile = await LabFileModel.create({
          name: filename,
          mimetype: file.mimetype,
          data: buffer,
        });

        req.body.attachedFiles.push(savedFile._id);
      }

      next();
    } catch (error: any) {
      logger.error("File processing failed:", error);
      return ResponseHandler.sendErrorResponse({
        res,
        code: HTTP_CODES.INTERNAL_SERVER_ERROR,
        error: "Internal server error",
      });
    }
  });
};
