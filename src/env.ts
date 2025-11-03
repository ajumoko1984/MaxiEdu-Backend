import { ZodError, z } from "zod";

export const envSchema = z.object({
  PORT: z.string().optional(),
  DB_HOST: z.string(),
  DB_PORT: z.string(),
  DB_USER: z.string(),
  DB_PASSWORD: z.string(),
  DB_NAME: z.string(),
  NODE_ENV: z.string(),
  DATABASE_URI: z.string(),
  APP_PORT: z.string(),
  SERVER_TOKEN_SECRET: z.string(),
  TOKEN_EXPIRE_TIME: z.string(),
});

// Validate environment variables
export function validateEnv() {
  try {
    return envSchema.parse(process.env);
  } catch (error) {
    if (error instanceof ZodError) {
      const missingEnvs = error.issues
        .map((issue) => issue.path.join('.'))
        .join('\n');

      console.error(`Missing or invalid environment variables: \n${missingEnvs}`);
      process.exit(1);
    }
    throw error;
  }
}

// Export validated environment
export const env = validateEnv();