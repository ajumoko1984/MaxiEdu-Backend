import { z } from "zod";
import { envSchema } from "../env";

declare global {
  namespace NodeJS {
    interface ProcessEnv extends z.infer<typeof envSchema> {}
  }

  namespace Express {
    interface Request {
      profileImage?: {
        buffer: Buffer;
        base64: string;
        mimetype: string;
      };
    }
  }
}

export {};
