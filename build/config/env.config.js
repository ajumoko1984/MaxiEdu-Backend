"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateEnv = exports.env = exports.NODE_ENV = exports.APP_PORT = exports.DB_HOST = exports.DB_NAME = exports.DB_USER = exports.DB_PORT = exports.DB_PASSWORD = exports.FRONTEND_URL = exports.SERVER_TOKEN_SECRET = exports.SERVER_TOKEN_ISSUER = exports.TOKEN_EXPIRE_TIME = void 0;
const dotenv_1 = require("dotenv");
const joi_1 = __importDefault(require("joi"));
const path_1 = __importDefault(require("path"));
(0, dotenv_1.config)({ path: path_1.default.resolve(__dirname, "../../.env") });
_a = process.env, exports.TOKEN_EXPIRE_TIME = _a.TOKEN_EXPIRE_TIME, exports.SERVER_TOKEN_ISSUER = _a.SERVER_TOKEN_ISSUER, exports.SERVER_TOKEN_SECRET = _a.SERVER_TOKEN_SECRET, exports.FRONTEND_URL = _a.FRONTEND_URL, exports.DB_PASSWORD = _a.DB_PASSWORD, exports.DB_PORT = _a.DB_PORT, exports.DB_USER = _a.DB_USER, exports.DB_NAME = _a.DB_NAME, exports.DB_HOST = _a.DB_HOST, exports.APP_PORT = _a.APP_PORT, exports.NODE_ENV = _a.NODE_ENV;
exports.env = {
    isDev: String(exports.NODE_ENV).toLowerCase().includes("development"),
    isTest: String(exports.NODE_ENV).toLowerCase().includes("test"),
    isProd: String(exports.NODE_ENV).toLowerCase().includes("production"),
    isStaging: String(exports.NODE_ENV).toLowerCase().includes("staging"),
    env: exports.NODE_ENV,
};
const schema = joi_1.default.object({});
const validateAppConfig = (schema, config) => {
    const result = schema.validate(config, {
        abortEarly: false,
        allowUnknown: true,
    });
    if (result.error) {
        console.error("Application configuration error.", {
            details: result.error.details,
        });
        throw result.error;
    }
};
const validateEnv = () => {
    try {
        validateAppConfig(schema, process.env);
    }
    catch (e) {
        process.exit(1);
    }
};
exports.validateEnv = validateEnv;
//# sourceMappingURL=env.config.js.map