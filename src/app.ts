import "reflect-metadata";
import path from "path";
import compression from "compression";
import express, { Express, Request, Response, NextFunction } from "express";
import cors from "cors";
import swaggerUi from 'swagger-ui-express';
import { specs } from './config/swagger';
import Logger from "./utils/logger";
import { IUsers } from "./interfaces/users.interface";
import { HTTP_CODES, Namespaces } from "./config/constants";
import ResponseHandler from "./utils/response-handler";

export interface ExpressRequest extends Request {
  user?: IUsers;
}

export const createApp = (
  bindRoutes: (app: Express) => void,
  name: string = "Blackhole"
): Express => {
  const app = express();
  const logger = new Logger("general", Namespaces.Entry);

  // CORS configuration
  app.use(cors({
    origin: process.env.FRONTEND_URL || '*',
    credentials: true
  }));

  // Security headers
  app.use((req: Request, res: Response, next: NextFunction) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
    next();
  });

  // Swagger UI
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

  // Request logging
  app.use((req: Request, res: Response, next: NextFunction) => {
    logger.info(
      `METHOD: [${req.method}] - URL: [${req.url}] - IP: [${req.socket.remoteAddress}]`
    );

    res.on("finish", () => {
      logger.info(
        `METHOD: [${req.method}] - URL: [${req.url}] - STATUS: [${res.statusCode}] - IP: [${req.socket.remoteAddress}]`
      );
    });

    next();
  });

  app.use(
    compression({
      level: 6,
    })
  );

  app.set("trust proxy", true);
  app.set("views", path.join(__dirname, "views"));
  app.set("view engine", "handlebars");

  app.use(express.json({ limit: "5mb" }));
  app.use(express.urlencoded({ extended: true }));
  app.use(express.static(__dirname));
  app.disable("x-powered-by");

  bindRoutes(app);

  // Health check for hosting providers
  app.get('/health', (req: Request, res: Response) => {
    return res.status(200).json({ status: 'ok' });
  });

  app.get("/", async (req: Request, res: Response) => {
    return ResponseHandler.sendSuccessResponse({
      res,
      code: HTTP_CODES.OK,
      message: `Welcome to ${name}`,
    });
  });

  /**
   *
   * 404 - Not Found Error Handler
   *
   */
  app.all("*", (req, res: Response) => {
    logger.error(`Requested route not found | PATH: [${req.url}]`);
    return ResponseHandler.sendErrorResponse({
      res,
      code: HTTP_CODES.NOT_FOUND,
      error: "Requested route not found",
    });
  });

  return app;
};
