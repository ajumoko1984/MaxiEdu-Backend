// school-auth.controller.ts
import { Response } from "express";
import bcryptjs from "bcryptjs";
import usersRepository from "../repository/users.repository";
import ResponseHandler from "../utils/response-handler";
import { HTTP_CODES } from "../config/constants";
import { validateEmail } from "../utils";
import { ExpressRequest } from "../app";
import Logger from "../utils/logger";
import { ROLE } from "../enums/role.enum";
import schoolRepository from "../repository/school.repository";
import { generateJwtToken } from "../utils/jwt";

const logger = new Logger("School Auth Controller");

class SchoolAuthController {
  // Self-register school admin (Option B)
  async registerSchoolAdmin(req: ExpressRequest, res: Response) {
    try {
      const { firstName, lastName, email, password, schoolId } = req.body;

      // validate email format
      if (!(await validateEmail(email))) {
        return ResponseHandler.sendErrorResponse({
          res,
          code: HTTP_CODES.BAD_REQUEST,
          error: "Email is invalid",
        });
      }

      // normalize email (same as your super-admin)
      const normalizedEmail = email.replace(/\+[^@]*/, "");

      // check existing user
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

      // optional: if schoolId provided, verify school exists
      if (schoolId) {
        // if you don't have a schoolsRepository yet, skip or implement accordingly
        const school = await schoolRepository?.findOne({ id: schoolId });
        if (!school) {
          return ResponseHandler.sendErrorResponse({
            res,
            code: HTTP_CODES.NOT_FOUND,
            error: "No school found for provided schoolId",
          });
        }
      }

      // Hash password
      const hashedPassword = await bcryptjs.hash(password, 10);

      // IMPORTANT: Because super-admin controls overall, new admin accounts should be inactive by default
      // and require super-admin approval. Set isActive = false.
      const user = await usersRepository.create({
        firstName,
        lastName,
        email: normalizedEmail,
        password: hashedPassword,
        accountType: ROLE.ADMIN,
        isDefaultPassword: true, // since user created their own password, you may set false. Set true if you want them to change it on first login.
        isActive: false, // require approval
      });

      const { password: userPassword, ...userWithoutPassword } = user as any;

      return ResponseHandler.sendSuccessResponse({
        res,
        code: HTTP_CODES.CREATED,
        message:
          "School admin account created successfully. Awaiting super-admin approval.",
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

  // Super-admin endpoint: approve (activate) a school admin
  // This should be protected with isAuth + isSuperAdmin middleware
async approveSchoolAdmin(req: ExpressRequest, res: Response) {
  try {
    const { email } = req.body;

    if (!email) {
      return ResponseHandler.sendErrorResponse({
        res,
        code: HTTP_CODES.BAD_REQUEST,
        error: "Email is required",
      });
    }

    const user = await usersRepository.findOne({ email });

    if (!user) {
      return ResponseHandler.sendErrorResponse({
        res,
        code: HTTP_CODES.NOT_FOUND,
        error: "No admin found with this email",
      });
    }

    // ensure we are approving admins only
    if (user.accountType !== ROLE.ADMIN) {
      return ResponseHandler.sendErrorResponse({
        res,
        code: HTTP_CODES.BAD_REQUEST,
        error: "This user is not a school admin",
      });
    }

    // already active?
    if (user.isActive) {
      return ResponseHandler.sendErrorResponse({
        res,
        code: HTTP_CODES.BAD_REQUEST,
        error: "This admin is already approved",
      });
    }

    const updated = await usersRepository.atomicUpdate(
      { email },
      { isActive: true }
    );

    return ResponseHandler.sendSuccessResponse({
      res,
      code: HTTP_CODES.OK,
      message: "School admin approved successfully",
      data: updated,
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

  // Optional: super-admin can deactivate school admin
  async deactivateSchoolAdmin(req: ExpressRequest, res: Response) {
    try {
      const { id } = req.params;
      const user = await usersRepository.findOne({ id });
      if (!user) {
        return ResponseHandler.sendErrorResponse({
          res,
          code: HTTP_CODES.NOT_FOUND,
          error: "No user found",
        });
      }

      if (user.accountType !== ROLE.ADMIN) {
        return ResponseHandler.sendErrorResponse({
          res,
          code: HTTP_CODES.BAD_REQUEST,
          error: "User is not a school admin",
        });
      }

      const updated = await usersRepository.atomicUpdate({ id }, { isActive: false });
      const { password: userPassword, ...userWithoutPassword } = updated as any;
      return ResponseHandler.sendSuccessResponse({
        res,
        code: HTTP_CODES.OK,
        message: "School admin deactivated",
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



  async loginSchoolAdmin(req: ExpressRequest, res: Response) {
    try {
      const { email, password } = req.body;
  
      const user = await usersRepository.findOne({ email });
  
      if (!user) {
        return ResponseHandler.sendErrorResponse({
          res,
          code: HTTP_CODES.BAD_REQUEST,
          error: "Invalid email or password",
        });
      }
  
      // ensure accountType is admin
      if (user.accountType !== ROLE.ADMIN) {
        return ResponseHandler.sendErrorResponse({
          res,
          code: HTTP_CODES.UNAUTHORIZED,
          error: "This account is not a school admin",
        });
      }
  
      // ensure approved
      if (!user.isActive) {
        return ResponseHandler.sendErrorResponse({
          res,
          code: HTTP_CODES.FORBIDDEN,
          error: "Your account is awaiting approval by super admin",
        });
      }
  
      // ensure not disabled or deleted
      if (user.isDisabled || user.isDeleted) {
        return ResponseHandler.sendErrorResponse({
          res,
          code: HTTP_CODES.FORBIDDEN,
          error: "This account is disabled",
        });
      }
  
      // compare passwords
      const passwordMatch = await bcryptjs.compare(password, user.password);
      if (!passwordMatch) {
        return ResponseHandler.sendErrorResponse({
          res,
          code: HTTP_CODES.UNAUTHORIZED,
          error: "Invalid email or password",
        });
      }
  
      // generate token (same as your super admin login)
      const token = await generateJwtToken({
        data: {
          id: user.id,
          email: user.email,
          accountType: user.accountType,
        },
      });
  
      const { password: _p, ...userWithoutPassword } = user as any;
  
      return ResponseHandler.sendSuccessResponse({
        res,
        code: HTTP_CODES.OK,
        message: "Login successful",
        data: {
          user: userWithoutPassword,
          token,
        },
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

export default new SchoolAuthController();


