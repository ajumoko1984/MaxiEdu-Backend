"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_config_1 = require("../config/env.config");
const response_handler_1 = __importDefault(require("../utils/response-handler"));
const constants_1 = require("../config/constants");
const auth = (options = []) => {
    return (req, res, next) => {
        let token;
        token = req.header("x-auth-token") || req.header("Authorization");
        if (token && token.startsWith("Bearer ")) {
            token = token.split(" ")[1];
        }
        if (!token) {
            return response_handler_1.default.sendErrorResponse({
                res,
                code: constants_1.HTTP_CODES.UNAUTHORIZED,
                error: "Access denied. No token provided",
            });
        }
        let payload;
        try {
            jsonwebtoken_1.default.verify(token, `${env_config_1.SERVER_TOKEN_SECRET}`, (error, decoded) => {
                if (error?.name === "JsonWebTokenError" ||
                    error?.name === "TokenExpiredError") {
                    return response_handler_1.default.sendErrorResponse({
                        res,
                        code: constants_1.HTTP_CODES.UNAUTHORIZED,
                        error: "Please log in",
                    });
                }
                else {
                    payload = decoded;
                }
            });
        }
        catch (ex) {
            return response_handler_1.default.sendErrorResponse({
                res,
                code: constants_1.HTTP_CODES.BAD_REQUEST,
                error: "Invalid Token",
            });
        }
        let loggedInAccount = null;
        if (payload.id) {
            loggedInAccount = {
                id: payload.id,
                accountType: payload.accountType,
            };
        }
        else {
            return response_handler_1.default.sendErrorResponse({
                res,
                code: constants_1.HTTP_CODES.UNAUTHORIZED,
                error: "Invalid Token",
            });
        }
        req.user = loggedInAccount;
        const handleAuth = handleAuthOptions(options, loggedInAccount, res);
        if (handleAuth) {
            return handleAuth;
        }
        next();
    };
};
function handleAuthOptions(options, loggedInAccount, res) {
    if (options.length > 0 && !options.includes(loggedInAccount.accountType)) {
        return response_handler_1.default.sendErrorResponse({
            res,
            code: constants_1.HTTP_CODES.FORBIDDEN,
            error: "Access denied. Insufficient permission.",
        });
    }
}
exports.default = {
    auth,
};
//# sourceMappingURL=auth.middleware.js.map