import { Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { ExpressRequest } from "../app";
import { SERVER_TOKEN_SECRET } from "../config/env.config";
import ResponseHandler from "../utils/response-handler";
import { HTTP_CODES } from "../config/constants";
import { ROLE } from "../enums/role.enum";
import { IUsers } from "../interfaces/users.interface";

type LoggedInAccount = IUsers;

const auth = (options: ROLE[] = []) => {
  return (req: ExpressRequest, res: Response, next: NextFunction) => {
    let token;
    token = req.header("x-auth-token") || req.header("Authorization");
    if (token && token.startsWith("Bearer ")) {
      token = token.split(" ")[1];
    }

    if (!token) {
      return ResponseHandler.sendErrorResponse({
        res,
        code: HTTP_CODES.UNAUTHORIZED,
        error: "Access denied. No token provided",
      });
    }

    let payload: any;
    try {
      jwt.verify(
        token,
        `${SERVER_TOKEN_SECRET}`,
        (error: any, decoded: any) => {
          if (
            error?.name === "JsonWebTokenError" ||
            error?.name === "TokenExpiredError"
          ) {
            return ResponseHandler.sendErrorResponse({
              res,
              code: HTTP_CODES.UNAUTHORIZED,
              error: "Please log in",
            });
          } else {
            payload = decoded;
          }
        }
      );
    } catch (ex) {
      return ResponseHandler.sendErrorResponse({
        res,
        code: HTTP_CODES.BAD_REQUEST,
        error: "Invalid Token",
      });
    }

    let loggedInAccount: LoggedInAccount | null = null;
    if (payload.id) {
      loggedInAccount = {
        id: payload.id,
        accountType: payload.accountType,
      } as IUsers;
    } else {
      return ResponseHandler.sendErrorResponse({
        res,
        code: HTTP_CODES.UNAUTHORIZED,
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

function handleAuthOptions(
  options: ROLE[],
  loggedInAccount: LoggedInAccount,
  res: Response
) {
  if (options.length > 0 && !options.includes(loggedInAccount.accountType!)) {
    return ResponseHandler.sendErrorResponse({
      res,
      code: HTTP_CODES.FORBIDDEN,
      error: "Access denied. Insufficient permission.",
    });
  }
}

export default {
  auth,
};
