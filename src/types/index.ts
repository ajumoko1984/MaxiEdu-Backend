import { z } from "zod";
import { envSchema } from "../env";

declare global {
  namespace NodeJS {
    interface ProcessEnv extends z.infer<typeof envSchema> {}
  }
}
