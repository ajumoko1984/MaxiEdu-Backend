import multer from "multer";
import sharp from "sharp";
import { HTTP_CODES, Namespaces } from "../config/constants";
import Logger from "../utils/logger";
import { ExpressRequest } from "../app";
import { NextFunction, Response } from "express";
import ResponseHandler from "../utils/response-handler";

const logger = new Logger("error", Namespaces.Entry);

const storage = multer.memoryStorage();

const allowedMimeTypes = ["image/jpeg", "image/png", "image/webp"];
const maxFileSize = 1 * 1024 * 1024; // 1MB

export default function fileUploader(fieldName = "profileImage") {
  return (req: ExpressRequest, res: Response, next: NextFunction) => {
    const upload = multer({
      storage,
      limits: { fileSize: maxFileSize },
      fileFilter: (req, file, cb) => {
        if (!allowedMimeTypes.includes(file.mimetype)) {
          return cb(
            new Error(
              `Invalid file type: ${file.mimetype}. Allowed: ${allowedMimeTypes.join(
                ", "
              )}`
            )
          );
        }
        cb(null, true);
      },
    }).single(fieldName);

    upload(req, res, async (err: any) => {
      if (err) {
        logger.error("Multer error:", err);
        let errorMessage = "Image upload error";

        if (err.code === "LIMIT_FILE_SIZE") {
          errorMessage = `Image too large. Max size is ${maxFileSize / 1024 / 1024}MB`;
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
        if (!req.file) return next();

        const optimizedBuffer = await sharp(req.file.buffer)
          .resize({ width: 600 })
          .webp({ quality: 70 })
          .toBuffer();

        const base64Image = optimizedBuffer.toString("base64");

        // ✅ Dynamically pick keys based on imageType param
        const imageType = req.params.imageType || "profile"; // default to profile
        if (imageType === "passport") {
          req.body.imageBase64 = base64Image;
          req.body.imageMimeType = "image/webp";
        } else {
          req.body.imageBase64 = base64Image;
          req.body.imageMimeType = "image/webp";
        }

        next();
      } catch (error) {
        logger.error("Image processing failed:", error);
        return ResponseHandler.sendErrorResponse({
          res,
          code: HTTP_CODES.INTERNAL_SERVER_ERROR,
          error: "Internal server error",
        });
      }
    });
  };
}
