"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createApp = void 0;
require("reflect-metadata");
const path_1 = __importDefault(require("path"));
const compression_1 = __importDefault(require("compression"));
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const swagger_1 = require("./config/swagger");
const logger_1 = __importDefault(require("./utils/logger"));
const constants_1 = require("./config/constants");
const response_handler_1 = __importDefault(require("./utils/response-handler"));
const createApp = (bindRoutes, name = "Blackhole") => {
    const app = (0, express_1.default)();
    const logger = new logger_1.default("general", constants_1.Namespaces.Entry);
    app.use((0, cors_1.default)({
        origin: process.env.FRONTEND_URL || '*',
        credentials: true
    }));
    app.use((req, res, next) => {
        res.setHeader('X-Content-Type-Options', 'nosniff');
        res.setHeader('X-Frame-Options', 'DENY');
        res.setHeader('X-XSS-Protection', '1; mode=block');
        res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
        next();
    });
    app.use('/api-docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swagger_1.specs));
    app.use((req, res, next) => {
        logger.info(`METHOD: [${req.method}] - URL: [${req.url}] - IP: [${req.socket.remoteAddress}]`);
        res.on("finish", () => {
            logger.info(`METHOD: [${req.method}] - URL: [${req.url}] - STATUS: [${res.statusCode}] - IP: [${req.socket.remoteAddress}]`);
        });
        next();
    });
    app.use((0, compression_1.default)({
        level: 6,
    }));
    app.set("trust proxy", true);
    app.set("views", path_1.default.join(__dirname, "views"));
    app.set("view engine", "handlebars");
    app.use(express_1.default.json({ limit: "5mb" }));
    app.use(express_1.default.urlencoded({ extended: true }));
    app.use(express_1.default.static(__dirname));
    app.disable("x-powered-by");
    bindRoutes(app);
    app.get('/health', (req, res) => {
        return res.status(200).json({ status: 'ok' });
    });
    app.get("/", async (req, res) => {
        return response_handler_1.default.sendSuccessResponse({
            res,
            code: constants_1.HTTP_CODES.OK,
            message: `Welcome to ${name}`,
        });
    });
    app.all("*", (req, res) => {
        logger.error(`Requested route not found | PATH: [${req.url}]`);
        return response_handler_1.default.sendErrorResponse({
            res,
            code: constants_1.HTTP_CODES.NOT_FOUND,
            error: "Requested route not found",
        });
    });
    return app;
};
exports.createApp = createApp;
//# sourceMappingURL=app.js.map