"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const users_repository_1 = __importDefault(require("../repository/users.repository"));
const jwt_1 = require("../utils/jwt");
const role_enum_1 = require("../enums/role.enum");
const response_handler_1 = __importDefault(require("../utils/response-handler"));
const constants_1 = require("../config/constants");
const utils_1 = require("../utils");
const logger_1 = __importDefault(require("../utils/logger"));
const constants_2 = require("../config/constants");
const logger = new logger_1.default("User Controller", constants_2.Namespaces.Entry);
function validateUser(res, user) {
    if (user?.isDefaultPassword) {
        response_handler_1.default.sendErrorResponse({
            code: constants_1.HTTP_CODES.FORBIDDEN,
            error: {
                data: user?.id,
                message: "Please change your default password to proceed.",
            },
            res,
        });
        return false;
    }
    if (user?.isDisabled) {
        response_handler_1.default.sendErrorResponse({
            code: constants_1.HTTP_CODES.FORBIDDEN,
            error: "Your user has been disabled. Please contact support for admin.",
            res,
        });
        return false;
    }
    if (user?.isDeleted) {
        response_handler_1.default.sendErrorResponse({
            res,
            code: constants_1.HTTP_CODES.NOT_FOUND,
            error: `This email address belongs to a deleted user. Please contact support for admin.`,
        });
        return false;
    }
    return true;
}
class UserController {
    async default(req, res) {
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
            if (await !(0, utils_1.validateEmail)(email)) {
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
    async admin(req, res) {
        try {
            const { firstName, lastName, email, password, role } = req.body;
            if (role !== role_enum_1.ROLE.ADMIN && role !== role_enum_1.ROLE.HR) {
                return response_handler_1.default.sendErrorResponse({
                    res,
                    code: constants_1.HTTP_CODES.BAD_REQUEST,
                    error: "Only admin or HR can be created",
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
                isActive: true,
            });
            const { password: userPassword, ...userWithoutPassword } = user;
            return response_handler_1.default.sendSuccessResponse({
                res,
                code: constants_1.HTTP_CODES.CREATED,
                message: `Admin account created successfully`,
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
            if (user) {
                const isValid = await validateUser(res, user);
                if (!isValid)
                    return;
            }
            else {
                return response_handler_1.default.sendErrorResponse({
                    res,
                    code: constants_1.HTTP_CODES.NOT_FOUND,
                    error: "No user found",
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
    async staff(req, res) {
        try {
            const { firstName, lastName, email, password, role } = req.body;
            if (role === role_enum_1.ROLE.ADMIN ||
                role === role_enum_1.ROLE.HR ||
                role === role_enum_1.ROLE.SUPER_ADMIN) {
                return response_handler_1.default.sendErrorResponse({
                    res,
                    code: constants_1.HTTP_CODES.BAD_REQUEST,
                    error: "Only staff can be created",
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
                isActive: true,
            });
            const { password: userPassword, ...userWithoutPassword } = user;
            return response_handler_1.default.sendSuccessResponse({
                res,
                code: constants_1.HTTP_CODES.CREATED,
                message: `${role} account created successfully`,
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
    async changeDefaultPassword(req, res) {
        try {
            const { oldPassword, newPassword } = req.body;
            const { userId } = req.params;
            const user = await users_repository_1.default.findOne({
                id: userId,
                isDefaultPassword: true,
            });
            const isPasswordValid = await bcryptjs_1.default.compare(oldPassword, user?.password);
            if (!isPasswordValid) {
                return response_handler_1.default.sendErrorResponse({
                    res,
                    code: constants_1.HTTP_CODES.UNAUTHORIZED,
                    error: "Incorrect old password",
                });
            }
            const hashedPassword = await bcryptjs_1.default.hash(newPassword, 10);
            const updatedUser = await users_repository_1.default.atomicUpdate({ id: userId }, { password: hashedPassword, isDefaultPassword: false });
            const { password, ...userWithoutPassword } = updatedUser;
            return response_handler_1.default.sendSuccessResponse({
                res,
                code: constants_1.HTTP_CODES.OK,
                message: `Password changed successfully`,
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
    async resetPassword(req, res) {
        try {
            const { id, password } = req.body;
            const user = await users_repository_1.default.findOne({ id });
            if (user) {
                const isValid = await validateUser(res, user);
                if (!isValid)
                    return;
            }
            else {
                return response_handler_1.default.sendErrorResponse({
                    res,
                    code: constants_1.HTTP_CODES.NOT_FOUND,
                    error: "No user found",
                });
            }
            if ((req.user?.id === user.id && req.user?.accountType === role_enum_1.ROLE.ADMIN) ||
                req.user?.accountType === role_enum_1.ROLE.HR) {
                return response_handler_1.default.sendErrorResponse({
                    res,
                    code: constants_1.HTTP_CODES.FORBIDDEN,
                    error: "Admin cannot reset their own password",
                });
            }
            if (user?.accountType === role_enum_1.ROLE.SUPER_ADMIN) {
                return response_handler_1.default.sendErrorResponse({
                    res,
                    code: constants_1.HTTP_CODES.FORBIDDEN,
                    error: "You cannot reset a super admin password",
                });
            }
            const hashedPassword = await bcryptjs_1.default.hash(password, 10);
            const updatedUser = await users_repository_1.default.atomicUpdate({ id }, { password: hashedPassword, isDefaultPassword: true });
            const { password: userPassword, ...userWithoutPassword } = updatedUser;
            return response_handler_1.default.sendSuccessResponse({
                res,
                code: constants_1.HTTP_CODES.OK,
                message: `Password reset successfully`,
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
    async getAllUsers(req, res) {
        try {
            const users = await users_repository_1.default.findAll(req.query);
            if (users.length === 0) {
                return response_handler_1.default.sendErrorResponse({
                    res,
                    code: constants_1.HTTP_CODES.NOT_FOUND,
                    error: "No users found",
                });
            }
            return response_handler_1.default.sendSuccessResponse({
                res,
                code: constants_1.HTTP_CODES.OK,
                message: "Users retrieved successfully",
                data: users,
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
    async getUser(req, res) {
        try {
            const { id } = req.params;
            const user = await users_repository_1.default.findOne({ id, isDeleted: false });
            if (!user) {
                return response_handler_1.default.sendErrorResponse({
                    res,
                    code: constants_1.HTTP_CODES.NOT_FOUND,
                    error: "No user found",
                });
            }
            return response_handler_1.default.sendSuccessResponse({
                res,
                code: constants_1.HTTP_CODES.OK,
                message: "User retrieved successfully",
                data: user,
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
    async accountDisabled(req, res) {
        try {
            const { id } = req.params;
            const user = await users_repository_1.default.findOne({ id });
            if (user?.accountType === role_enum_1.ROLE.SUPER_ADMIN) {
                return response_handler_1.default.sendErrorResponse({
                    res,
                    code: constants_1.HTTP_CODES.FORBIDDEN,
                    error: "You cannot disable a super admin account",
                });
            }
            if (user) {
                const isValid = await validateUser(res, user);
                if (!isValid)
                    return;
            }
            else {
                return response_handler_1.default.sendErrorResponse({
                    res,
                    code: constants_1.HTTP_CODES.NOT_FOUND,
                    error: "No user found",
                });
            }
            const updatedUser = await users_repository_1.default.atomicUpdate({ id }, { isDisabled: true });
            return response_handler_1.default.sendSuccessResponse({
                res,
                code: constants_1.HTTP_CODES.OK,
                message: `User disabled successfully`,
                data: updatedUser?.isDisabled,
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
    async deleteUser(req, res) {
        try {
            const { id } = req.params;
            const user = await users_repository_1.default.findOne({ id });
            if (user?.accountType === role_enum_1.ROLE.SUPER_ADMIN) {
                return response_handler_1.default.sendErrorResponse({
                    res,
                    code: constants_1.HTTP_CODES.FORBIDDEN,
                    error: "You cannot delete a super admin account",
                });
            }
            if ((req.user?.id === user?.id && req.user?.accountType === role_enum_1.ROLE.ADMIN) ||
                req.user?.accountType === role_enum_1.ROLE.HR)
                return response_handler_1.default.sendErrorResponse({
                    res,
                    code: constants_1.HTTP_CODES.FORBIDDEN,
                    error: "Admin cannot delete their own account",
                });
            await users_repository_1.default.atomicUpdate({ id }, { isDeleted: true });
            return response_handler_1.default.sendSuccessResponse({
                res,
                code: constants_1.HTTP_CODES.NO_CONTENT,
                message: "User deleted successfully",
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
}
exports.default = new UserController();
//# sourceMappingURL=user.controller.js.map