"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.clearJwtToken = exports.generateJwtToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const generateJwtToken = ({ data = {}, timeToLive = `${process.env.TOKEN_EXPIRE_TIME}` || "1h", secret = `${process.env.SERVER_TOKEN_SECRET}` || "secret", }) => {
    return new Promise((resolve, _reject) => {
        const signOptions = {
            issuer: "HMOSystems",
            subject: "Role Based Access Control",
            algorithm: "HS256",
            audience: ["The Staff", "The Admin", "The Super Admin"],
        };
        signOptions.expiresIn = timeToLive;
        jsonwebtoken_1.default.sign(data, secret, signOptions, (err, token) => {
            if (err) {
                console.error(err.message);
            }
            resolve(token);
        });
    });
};
exports.generateJwtToken = generateJwtToken;
const clearJwtToken = ({ data = {}, timeToLive = "2s", secret = "secret", }) => {
    return new Promise((resolve, _reject) => {
        const signOptions = {
            issuer: "HMOSystems",
            subject: "Role Based Access Control",
            algorithm: "HS256",
            audience: ["The Staff", "The Admin", "The Super Admin"],
        };
        signOptions.expiresIn = timeToLive;
        jsonwebtoken_1.default.sign(data, secret, signOptions, (err, token) => {
            if (err) {
                console.error(err.message);
            }
            resolve(token);
        });
    });
};
exports.clearJwtToken = clearJwtToken;
//# sourceMappingURL=jwt.js.map