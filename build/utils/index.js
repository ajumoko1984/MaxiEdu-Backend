"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NormalizeTransformer = exports.validateEmail = exports.verifyToken = void 0;
exports.throwIfUndefined = throwIfUndefined;
exports.generateReceiptNo = generateReceiptNo;
exports.incrementHospitalNumber = incrementHospitalNumber;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_config_1 = require("../config/env.config");
const verifyToken = async (token) => {
    try {
        const decoded = jsonwebtoken_1.default.verify(token, `${env_config_1.SERVER_TOKEN_SECRET}`);
        return { status: true, decoded };
    }
    catch (err) {
        return { status: false, error: err };
    }
};
exports.verifyToken = verifyToken;
const validateEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email?.toLowerCase().trim());
};
exports.validateEmail = validateEmail;
function throwIfUndefined(x, name) {
    if (x === undefined) {
        throw new Error(`${name} must not be undefined`);
    }
    return x;
}
function generateReceiptNo() {
    const receiptNo = Math.floor(100000 + Math.random() * 900000).toString();
    return `Kolak-${receiptNo.toString()}`;
}
function incrementHospitalNumber(current) {
    const [prefix, numberPart] = current.split("-");
    const nextNumber = parseInt(numberPart) + 1;
    return `${prefix}-${nextNumber.toString().padStart(6, "0")}`;
}
exports.NormalizeTransformer = {
    to: (value) => value?.trim().toLowerCase() || "",
    from: (value) => value || "",
};
//# sourceMappingURL=index.js.map