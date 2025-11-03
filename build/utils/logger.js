"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const winston_1 = __importDefault(require("winston"));
const dateFormat = () => new Date(Date.now()).toUTCString();
const baseLogger = winston_1.default.createLogger({
    transports: [
        new winston_1.default.transports.Console({
            format: winston_1.default.format.combine(winston_1.default.format.colorize()),
            level: "info",
            handleExceptions: true,
        }),
        new winston_1.default.transports.File({
            filename: "./logs/general.log",
        }),
    ],
    format: winston_1.default.format.printf((info) => {
        return `${dateFormat()} | ${info.level.toUpperCase()} | ${info.message}`;
    }),
    exitOnError: false,
});
class LoggerService {
    constructor(route, namespace = "") {
        this.route = route;
        this.namespace = namespace;
        this.log_data = null;
    }
    setLogData(log_data) {
        this.log_data = log_data;
    }
    formatMessage(message) {
        let msg = `[${this.namespace}] [${this.route}] ${message}`;
        if (this.log_data)
            msg += ` | data: ${JSON.stringify(this.log_data)}`;
        return msg;
    }
    async info(message, obj = undefined) {
        baseLogger.log("info", message, { obj });
    }
    async debug(message, obj = undefined) {
        baseLogger.log("debug", message, {
            obj,
        });
    }
    async error(message, obj = undefined) {
        baseLogger.log("error", message, {
            obj,
        });
    }
}
exports.default = LoggerService;
//# sourceMappingURL=logger.js.map