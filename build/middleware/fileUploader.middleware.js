"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fileUploader = void 0;
const multer_1 = __importDefault(require("multer"));
const sharp_1 = __importDefault(require("sharp"));
const constants_1 = require("../config/constants");
const logger_1 = __importDefault(require("../utils/logger"));
const response_handler_1 = __importDefault(require("../utils/response-handler"));
const labFile_model_1 = __importDefault(require("../models/labFile.model"));
const logger = new logger_1.default("error", constants_1.Namespaces.Entry);
const storage = multer_1.default.memoryStorage();
const allowedMimeTypes = [
    "image/jpeg",
    "image/png",
    "image/webp",
    "application/pdf",
];
const maxFileSize = 1 * 1024 * 1024;
const fileUploader = (req, res, next) => {
    const upload = (0, multer_1.default)({
        storage,
        limits: { fileSize: maxFileSize },
        fileFilter: (req, file, cb) => {
            if (!allowedMimeTypes.includes(file.mimetype)) {
                return cb(new Error(`Invalid file type: ${file.mimetype}. Allowed: ${allowedMimeTypes.join(", ")}`));
            }
            cb(null, true);
        },
    }).array("upload", 5) ||
        (0, multer_1.default)({
            storage,
            limits: { fileSize: maxFileSize },
            fileFilter: (req, file, cb) => {
                if (!allowedMimeTypes.includes(file.mimetype)) {
                    return cb(new Error(`Invalid file type: ${file.mimetype}. Allowed: ${allowedMimeTypes.join(", ")}`));
                }
                cb(null, true);
            },
        }).single("upload");
    upload(req, res, async (err) => {
        if (err) {
            logger.error("Multer error:", err);
            let errorMessage = "File upload error";
            if (err.code === "LIMIT_FILE_SIZE") {
                errorMessage = `File too large. Max size is ${maxFileSize / 1024 / 1024}MB`;
            }
            else if (err.message) {
                errorMessage = err.message;
            }
            return response_handler_1.default.sendErrorResponse({
                res,
                code: constants_1.HTTP_CODES.BAD_REQUEST,
                error: errorMessage,
            });
        }
        try {
            const uploadFiles = Array.isArray(req.files)
                ? req.files
                : req.file
                    ? [req.file]
                    : [];
            req.body.attachedFiles = req.body.attachedFiles || [];
            for (const file of uploadFiles) {
                let buffer = file.buffer;
                let filename = file.originalname;
                if (file.mimetype.startsWith("image/")) {
                    buffer = await (0, sharp_1.default)(buffer)
                        .resize({ width: 800 })
                        .webp({ quality: 60 })
                        .toBuffer();
                    filename = filename.replace(/\..+$/, ".webp");
                }
                const savedFile = await labFile_model_1.default.create({
                    name: filename,
                    mimetype: file.mimetype,
                    data: buffer,
                });
                req.body.attachedFiles.push(savedFile._id);
            }
            next();
        }
        catch (error) {
            logger.error("File processing failed:", error);
            return response_handler_1.default.sendErrorResponse({
                res,
                code: constants_1.HTTP_CODES.INTERNAL_SERVER_ERROR,
                error: "Internal server error",
            });
        }
    });
};
exports.fileUploader = fileUploader;
//# sourceMappingURL=fileUploader.middleware.js.map