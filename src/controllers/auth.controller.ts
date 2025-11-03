import { Response } from "express";
import bcryptjs from "bcryptjs";
import JWT from "jsonwebtoken";
import usersRepository from "../repository/users.repository";
import { generateJwtToken, clearJwtToken } from "../utils/jwt";
import ResponseHandler from "../utils/response-handler";
import { HTTP_CODES } from "../config/constants";
import { validateEmail } from "../utils";
import { ExpressRequest } from "../app";
import Logger from "../utils/logger";
import { ROLE } from "../enums/role.enum";
import { SERVER_TOKEN_SECRET } from "../config/env.config";

const logger = new Logger("Auth Controller");

class AuthController {
  // Register initial super admin
  async registerSuperAdmin(req: ExpressRequest, res: Response) {
    try {
      const { firstName, lastName, email, password, role } = req.body;

      if (role !== ROLE.SUPER_ADMIN) {
        return ResponseHandler.sendErrorResponse({
          res,
          code: HTTP_CODES.BAD_REQUEST,
          error: "Only super admin can be created",
        });
      }

      const normalizedEmail = email.replace(/\+[^@]*/, "");

      if (!(await validateEmail(email))) {
        return ResponseHandler.sendErrorResponse({
          res,
          code: HTTP_CODES.BAD_REQUEST,
          error: "Email is invalid",
        });
      }

      const isSuperAdmin = await usersRepository.findOne({
        accountType: ROLE.SUPER_ADMIN,
      });

      if (isSuperAdmin) {
        return ResponseHandler.sendErrorResponse({
          res,
          code: HTTP_CODES.BAD_REQUEST,
          error: "Super admin already exists",
        });
      }

      const emailExist = await usersRepository.findOne({
        email: normalizedEmail,
      });

      if (emailExist) {
        return ResponseHandler.sendErrorResponse({
          res,
          code: HTTP_CODES.BAD_REQUEST,
          error: "Email already registered",
        });
      }

      const hashedPassword = await bcryptjs.hash(password, 10);

      const user = await usersRepository.create({
        firstName,
        lastName,
        email: normalizedEmail,
        password: hashedPassword,
        accountType: role,
        isDefaultPassword: false,
        isActive: true,
      });

      const { password: userPassword, ...userWithoutPassword } = user as any;

      return ResponseHandler.sendSuccessResponse({
        res,
        code: HTTP_CODES.CREATED,
        message: `Super admin account created successfully`,
        data: userWithoutPassword,
      });
    } catch (error: any) {
      logger.error(error);
      return ResponseHandler.sendErrorResponse({
        res,
        code: HTTP_CODES.INTERNAL_SERVER_ERROR,
        error: "Internal server error",
      });
    }
  }

  // Login for all users
  async login(req: ExpressRequest, res: Response) {
    try {
      const { email, password } = req.body;

      if (!(await validateEmail(email))) {
        return ResponseHandler.sendErrorResponse({
          res,
          code: HTTP_CODES.BAD_REQUEST,
          error: "Email is invalid",
        });
      }

      const user = await usersRepository.findOne({ email });
      if (!user) {
        return ResponseHandler.sendErrorResponse({
          res,
          code: HTTP_CODES.NOT_FOUND,
          error: "No user found",
        });
      }

      if (user.isDisabled || user.isDeleted) {
        return ResponseHandler.sendErrorResponse({
          res,
          code: HTTP_CODES.FORBIDDEN,
          error: "Account not available",
        });
      }

      const isPasswordValid = await bcryptjs.compare(password, user.password);
      if (!isPasswordValid) {
        return ResponseHandler.sendErrorResponse({
          res,
          code: HTTP_CODES.UNAUTHORIZED,
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

      const jwtToken = await generateJwtToken({ data: jwtData });

      const { password: userPassword, ...userWithoutPassword } = user as any;
      return ResponseHandler.sendSuccessResponse({
        res,
        code: HTTP_CODES.OK,
        message: "Login successful",
        data: { token: jwtToken, ...userWithoutPassword },
      });
    } catch (error: any) {
      logger.error(error);
      return ResponseHandler.sendErrorResponse({
        res,
        code: HTTP_CODES.INTERNAL_SERVER_ERROR,
        error: "Internal server error",
      });
    }
  }

  // Logout current session
  async logout(req: ExpressRequest, res: Response) {
    try {
      const id = req.user?.id;
      const user = await usersRepository.findOne({ id });

      if (!user) {
        return ResponseHandler.sendErrorResponse({
          res,
          code: HTTP_CODES.NOT_FOUND,
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

      const token = await clearJwtToken({ data: jwtData });

      return ResponseHandler.sendSuccessResponse({
        res,
        code: HTTP_CODES.OK,
        data: token,
        message: "User logged out successfully",
      });
    } catch (error: any) {
      logger.error(error);
      return ResponseHandler.sendErrorResponse({
        res,
        code: HTTP_CODES.INTERNAL_SERVER_ERROR,
        error: "Internal server error",
      });
    }
  }

  // Forgot password - generate reset token (returned in response; production: send email)
  async forgotPassword(req: ExpressRequest, res: Response) {
    try {
      const { email } = req.body;
      if (!(await validateEmail(email))) {
        return ResponseHandler.sendErrorResponse({
          res,
          code: HTTP_CODES.BAD_REQUEST,
          error: "Email is invalid",
        });
      }

      const user = await usersRepository.findOne({ email });
      if (!user) {
        return ResponseHandler.sendErrorResponse({
          res,
          code: HTTP_CODES.NOT_FOUND,
          error: "No user found",
        });
      }

      const resetToken = await generateJwtToken({
        data: { id: user.id, email: user.email, action: "reset-password" },
        timeToLive: "15m",
      });

      // In a real app send this token by email. For now return the token.
      return ResponseHandler.sendSuccessResponse({
        res,
        code: HTTP_CODES.OK,
        message: "Password reset token generated",
        data: { token: resetToken },
      });
    } catch (error: any) {
      logger.error(error);
      return ResponseHandler.sendErrorResponse({
        res,
        code: HTTP_CODES.INTERNAL_SERVER_ERROR,
        error: "Internal server error",
      });
    }
  }

  // Reset password using token
  async resetPassword(req: ExpressRequest, res: Response) {
    try {
      const { token, password } = req.body;
      if (!token || !password) {
        return ResponseHandler.sendErrorResponse({
          res,
          code: HTTP_CODES.BAD_REQUEST,
          error: "Token and new password are required",
        });
      }

      let payload: any = null;
      try {
        payload = JWT.verify(token, `${SERVER_TOKEN_SECRET}`);
      } catch (err: any) {
        return ResponseHandler.sendErrorResponse({
          res,
          code: HTTP_CODES.UNAUTHORIZED,
          error: "Invalid or expired reset token",
        });
      }

      if (!payload?.id || payload?.action !== "reset-password") {
        return ResponseHandler.sendErrorResponse({
          res,
          code: HTTP_CODES.BAD_REQUEST,
          error: "Invalid reset token",
        });
      }

      const user = await usersRepository.findOne({ id: payload.id });
      if (!user) {
        return ResponseHandler.sendErrorResponse({
          res,
          code: HTTP_CODES.NOT_FOUND,
          error: "No user found",
        });
      }

      const hashedPassword = await bcryptjs.hash(password, 10);
      const updatedUser = await usersRepository.atomicUpdate(
        { id: user.id },
        { password: hashedPassword, isDefaultPassword: false }
      );

      const { password: userPassword, ...userWithoutPassword } = updatedUser as any;

      return ResponseHandler.sendSuccessResponse({
        res,
        code: HTTP_CODES.OK,
        message: "Password reset successfully",
        data: userWithoutPassword,
      });
    } catch (error: any) {
      logger.error(error);
      return ResponseHandler.sendErrorResponse({
        res,
        code: HTTP_CODES.INTERNAL_SERVER_ERROR,
        error: "Internal server error",
      });
    }
  }

  // Get user profile
  async getProfile(req: ExpressRequest, res: Response) {
    try {
      const id = req.user?.id;
      const user = await usersRepository.findOne({ id });
      if (!user) {
        return ResponseHandler.sendErrorResponse({
          res,
          code: HTTP_CODES.NOT_FOUND,
          error: "No user found",
        });
      }

      const { password: userPassword, ...userWithoutPassword } = user as any;
      return ResponseHandler.sendSuccessResponse({
        res,
        code: HTTP_CODES.OK,
        data: userWithoutPassword,
      });
    } catch (error: any) {
      logger.error(error);
      return ResponseHandler.sendErrorResponse({
        res,
        code: HTTP_CODES.INTERNAL_SERVER_ERROR,
        error: "Internal server error",
      });
    }
  }

  // Update user profile
  async updateProfile(req: ExpressRequest, res: Response) {
    try {
      const id = req.user?.id;
      const allowed: any = {};
      const { firstName, lastName, phoneNumber } = req.body;
      if (firstName) allowed.firstName = firstName;
      if (lastName) allowed.lastName = lastName;
      if (phoneNumber) allowed.phoneNumber = phoneNumber;

      const updatedUser = await usersRepository.atomicUpdate({ id }, allowed);

      if (!updatedUser) {
        return ResponseHandler.sendErrorResponse({
          res,
          code: HTTP_CODES.NOT_FOUND,
          error: "No user found",
        });
      }

      const { password: userPassword, ...userWithoutPassword } = updatedUser as any;

      return ResponseHandler.sendSuccessResponse({
        res,
        code: HTTP_CODES.OK,
        message: "Profile updated successfully",
        data: userWithoutPassword,
      });
    } catch (error: any) {
      logger.error(error);
      return ResponseHandler.sendErrorResponse({
        res,
        code: HTTP_CODES.INTERNAL_SERVER_ERROR,
        error: "Internal server error",
      });
    }
  }
}

export default new AuthController();
