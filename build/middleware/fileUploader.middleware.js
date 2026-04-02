"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = fileUploader;
const multer_1 = __importDefault(require("multer"));
const sharp_1 = __importDefault(require("sharp"));
const constants_1 = require("../config/constants");
const logger_1 = __importDefault(require("../utils/logger"));
const response_handler_1 = __importDefault(require("../utils/response-handler"));
const logger = new logger_1.default("error", constants_1.Namespaces.Entry);
const storage = multer_1.default.memoryStorage();
const allowedMimeTypes = ["image/jpeg", "image/png", "image/webp"];
const maxFileSize = 1 * 1024 * 1024;
function fileUploader(fieldName = "profileImage") {
    return (req, res, next) => {
        const upload = (0, multer_1.default)({
            storage,
            limits: { fileSize: maxFileSize },
            fileFilter: (req, file, cb) => {
                if (!allowedMimeTypes.includes(file.mimetype)) {
                    return cb(new Error(`Invalid file type: ${file.mimetype}. Allowed: ${allowedMimeTypes.join(", ")}`));
                }
                cb(null, true);
            },
        }).single(fieldName);
        upload(req, res, async (err) => {
            if (err) {
                logger.error("Multer error:", err);
                let errorMessage = "Image upload error";
                if (err.code === "LIMIT_FILE_SIZE") {
                    errorMessage = `Image too large. Max size is ${maxFileSize / 1024 / 1024}MB`;
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
                if (!req.file)
                    return next();
                const optimizedBuffer = await (0, sharp_1.default)(req.file.buffer)
                    .resize({ width: 600 })
                    .webp({ quality: 70 })
                    .toBuffer();
                const base64Image = optimizedBuffer.toString("base64");
                const imageType = req.params.imageType || "profile";
                if (imageType === "passport") {
                    req.body.imageBase64 = base64Image;
                    req.body.imageMimeType = "image/webp";
                }
                else {
                    req.body.imageBase64 = base64Image;
                    req.body.imageMimeType = "image/webp";
                }
                next();
            }
            catch (error) {
                logger.error("Image processing failed:", error);
                return response_handler_1.default.sendErrorResponse({
                    res,
                    code: constants_1.HTTP_CODES.INTERNAL_SERVER_ERROR,
                    error: "Internal server error",
                });
            }
        });
    };
}
//# sourceMappingURL=fileUploader.middleware.js.map