"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const users_repository_1 = __importDefault(require("../repository/users.repository"));
const jwt_1 = require("../utils/jwt");
const response_handler_1 = __importDefault(require("../utils/response-handler"));
const constants_1 = require("../config/constants");
const utils_1 = require("../utils");
const logger_1 = __importDefault(require("../utils/logger"));
const role_enum_1 = require("../enums/role.enum");
const env_config_1 = require("../config/env.config");
const logger = new logger_1.default("Auth Controller");
class AuthController {
    async registerSuperAdmin(req, res) {
        try {
            const { firstName, lastName, email, password, role } = req.body;
            if (role !== role_enum_1.ROLE.SUPER_ADMIN) {
                return response_handler_1.default.sendErrorResponse({
                    res,
                    code: constants_1.HTTP_CODES.BAD_REQUEST,
                    error: "Only super admin can be created",
                });
            }
            const normalizedEmail = email.replace(/\+[^@]*/, "");
            if (!(await (0, utils_1.validateEmail)(email))) {
                return response_handler_1.default.sendErrorResponse({
                    res,
                    code: constants_1.HTTP_CODES.BAD_REQUEST,
                    error: "Email is invalid",
                });
            }
            const isSuperAdmin = await users_repository_1.default.findOne({
                accountType: role_enum_1.ROLE.SUPER_ADMIN,
            });
            if (isSuperAdmin) {
                return response_handler_1.default.sendErrorResponse({
                    res,
                    code: constants_1.HTTP_CODES.BAD_REQUEST,
                    error: "Super admin already exists",
                });
            }
            const emailExist = await users_repository_1.default.findOne({
                email: normalizedEmail,
            });
            if (emailExist) {
                return response_handler_1.default.sendErrorResponse({
                    res,
                    code: constants_1.HTTP_CODES.BAD_REQUEST,
                    error: "Email already registered",
                });
            }
            const hashedPassword = await bcryptjs_1.default.hash(password, 10);
            const user = await users_repository_1.default.create({
                firstName,
                lastName,
                email: normalizedEmail,
                password: hashedPassword,
                accountType: role,
                isDefaultPassword: false,
                isActive: true,
            });
            const { password: userPassword, ...userWithoutPassword } = user;
            return response_handler_1.default.sendSuccessResponse({
                res,
                code: constants_1.HTTP_CODES.CREATED,
                message: `Super admin account created successfully`,
                data: userWithoutPassword,
            });
        }
        catch (error) {
            logger.error(error);
            return response_handler_1.default.sendErrorResponse({
                res,
                code: constants_1.HTTP_CODES.INTERNAL_SERVER_ERROR,
                error: "Internal server error",
            });
        }
    }
    async login(req, res) {
        try {
            const { email, password } = req.body;
            if (!(await (0, utils_1.validateEmail)(email))) {
                return response_handler_1.default.sendErrorResponse({
                    res,
                    code: constants_1.HTTP_CODES.BAD_REQUEST,
                    error: "Email is invalid",
                });
            }
            const user = await users_repository_1.default.findOne({ email });
            if (!user) {
                return response_handler_1.default.sendErrorResponse({
                    res,
                    code: constants_1.HTTP_CODES.NOT_FOUND,
                    error: "No user found",
                });
            }
            if (user.isDisabled || user.isDeleted) {
                return response_handler_1.default.sendErrorResponse({
                    res,
                    code: constants_1.HTTP_CODES.FORBIDDEN,
                    error: "Account not available",
                });
            }
            const isPasswordValid = await bcryptjs_1.default.compare(password, user.password);
            if (!isPasswordValid) {
                return response_handler_1.default.sendErrorResponse({
                    res,
                    code: constants_1.HTTP_CODES.UNAUTHORIZED,
                    error: "Incorrect password",
                });
            }
            const jwtData = {
                id: user.id,
                email: user.email,
                accountType: user.accountType,
                firstName: user.firstName,
                lastName: user.lastName,
            };
            const jwtToken = await (0, jwt_1.generateJwtToken)({ data: jwtData });
            const { password: userPassword, ...userWithoutPassword } = user;
            return response_handler_1.default.sendSuccessResponse({
                res,
                code: constants_1.HTTP_CODES.OK,
                message: "Login successful",
                data: { token: jwtToken, ...userWithoutPassword },
            });
        }
        catch (error) {
            logger.error(error);
            return response_handler_1.default.sendErrorResponse({
                res,
                code: constants_1.HTTP_CODES.INTERNAL_SERVER_ERROR,
                error: "Internal server error",
            });
        }
    }
    async logout(req, res) {
        try {
            const id = req.user?.id;
            const user = await users_repository_1.default.findOne({ id });
            if (!user) {
                return response_handler_1.default.sendErrorResponse({
                    res,
                    code: constants_1.HTTP_CODES.NOT_FOUND,
                    error: "No user found",
                });
            }
            const jwtData = {
                id: user.id,
                email: user.email,
                accountType: user.accountType,
                firstName: user.firstName,
                lastName: user.lastName,
            };
            const token = await (0, jwt_1.clearJwtToken)({ data: jwtData });
            return response_handler_1.default.sendSuccessResponse({
                res,
                code: constants_1.HTTP_CODES.OK,
                data: token,
                message: "User logged out successfully",
            });
        }
        catch (error) {
            logger.error(error);
            return response_handler_1.default.sendErrorResponse({
                res,
                code: constants_1.HTTP_CODES.INTERNAL_SERVER_ERROR,
                error: "Internal server error",
            });
        }
    }
    async forgotPassword(req, res) {
        try {
            const { email } = req.body;
            if (!(await (0, utils_1.validateEmail)(email))) {
                return response_handler_1.default.sendErrorResponse({
                    res,
                    code: constants_1.HTTP_CODES.BAD_REQUEST,
                    error: "Email is invalid",
                });
            }
            const user = await users_repository_1.default.findOne({ email });
            if (!user) {
                return response_handler_1.default.sendErrorResponse({
                    res,
                    code: constants_1.HTTP_CODES.NOT_FOUND,
                    error: "No user found",
                });
            }
            const resetToken = await (0, jwt_1.generateJwtToken)({
                data: { id: user.id, email: user.email, action: "reset-password" },
                timeToLive: "15m",
            });
            return response_handler_1.default.sendSuccessResponse({
                res,
                code: constants_1.HTTP_CODES.OK,
                message: "Password reset token generated",
                data: { token: resetToken },
            });
        }
        catch (error) {
            logger.error(error);
            return response_handler_1.default.sendErrorResponse({
                res,
                code: constants_1.HTTP_CODES.INTERNAL_SERVER_ERROR,
                error: "Internal server error",
            });
        }
    }
    async resetPassword(req, res) {
        try {
            const { token, password } = req.body;
            if (!token || !password) {
                return response_handler_1.default.sendErrorResponse({
                    res,
                    code: constants_1.HTTP_CODES.BAD_REQUEST,
                    error: "Token and new password are required",
                });
            }
            let payload = null;
            try {
                payload = jsonwebtoken_1.default.verify(token, `${env_config_1.SERVER_TOKEN_SECRET}`);
            }
            catch (err) {
                return response_handler_1.default.sendErrorResponse({
                    res,
                    code: constants_1.HTTP_CODES.UNAUTHORIZED,
                    error: "Invalid or expired reset token",
                });
            }
            if (!payload?.id || payload?.action !== "reset-password") {
                return response_handler_1.default.sendErrorResponse({
                    res,
                    code: constants_1.HTTP_CODES.BAD_REQUEST,
                    error: "Invalid reset token",
                });
            }
            const user = await users_repository_1.default.findOne({ id: payload.id });
            if (!user) {
                return response_handler_1.default.sendErrorResponse({
                    res,
                    code: constants_1.HTTP_CODES.NOT_FOUND,
                    error: "No user found",
                });
            }
            const hashedPassword = await bcryptjs_1.default.hash(password, 10);
            const updatedUser = await users_repository_1.default.atomicUpdate({ id: user.id }, { password: hashedPassword, isDefaultPassword: false });
            const { password: userPassword, ...userWithoutPassword } = updatedUser;
            return response_handler_1.default.sendSuccessResponse({
                res,
                code: constants_1.HTTP_CODES.OK,
                message: "Password reset successfully",
                data: userWithoutPassword,
            });
        }
        catch (error) {
            logger.error(error);
            return response_handler_1.default.sendErrorResponse({
                res,
                code: constants_1.HTTP_CODES.INTERNAL_SERVER_ERROR,
                error: "Internal server error",
            });
        }
    }
    async getProfile(req, res) {
        try {
            const id = req.user?.id;
            const user = await users_repository_1.default.findOne({ id });
            if (!user) {
                return response_handler_1.default.sendErrorResponse({
                    res,
                    code: constants_1.HTTP_CODES.NOT_FOUND,
                    error: "No user found",
                });
            }
            const { password: userPassword, ...userWithoutPassword } = user;
            return response_handler_1.default.sendSuccessResponse({
                res,
                code: constants_1.HTTP_CODES.OK,
                data: userWithoutPassword,
            });
        }
        catch (error) {
            logger.error(error);
            return response_handler_1.default.sendErrorResponse({
                res,
                code: constants_1.HTTP_CODES.INTERNAL_SERVER_ERROR,
                error: "Internal server error",
            });
        }
    }
    async updateProfile(req, res) {
        try {
            const id = req.user?.id;
            const allowed = {};
            const { firstName, lastName, phoneNumber } = req.body;
            if (firstName)
                allowed.firstName = firstName;
            if (lastName)
                allowed.lastName = lastName;
            if (phoneNumber)
                allowed.phoneNumber = phoneNumber;
            const updatedUser = await users_repository_1.default.atomicUpdate({ id }, allowed);
            if (!updatedUser) {
                return response_handler_1.default.sendErrorResponse({
                    res,
                    code: constants_1.HTTP_CODES.NOT_FOUND,
                    error: "No user found",
                });
            }
            const { password: userPassword, ...userWithoutPassword } = updatedUser;
            return response_handler_1.default.sendSuccessResponse({
                res,
                code: constants_1.HTTP_CODES.OK,
                message: "Profile updated successfully",
                data: userWithoutPassword,
            });
        }
        catch (error) {
            logger.error(error);
            return response_handler_1.default.sendErrorResponse({
                res,
                code: constants_1.HTTP_CODES.INTERNAL_SERVER_ERROR,
                error: "Internal server error",
            });
        }
    }
}
exports.default = new AuthController();
//# sourceMappingURL=auth.controller.js.map