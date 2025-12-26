"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = exports.envSchema = void 0;
exports.validateEnv = validateEnv;
const zod_1 = require("zod");
exports.envSchema = zod_1.z.object({
    PORT: zod_1.z.string().optional(),
    DB_HOST: zod_1.z.string(),
    DB_PORT: zod_1.z.string(),
    DB_USER: zod_1.z.string(),
    DB_PASSWORD: zod_1.z.string(),
    DB_NAME: zod_1.z.string(),
    NODE_ENV: zod_1.z.string(),
    APP_PORT: zod_1.z.string(),
    SERVER_TOKEN_SECRET: zod_1.z.string(),
    TOKEN_EXPIRE_TIME: zod_1.z.string(),
});
function validateEnv() {
    try {
        return exports.envSchema.parse(process.env);
    }
    catch (error) {
        if (error instanceof zod_1.ZodError) {
            const missingEnvs = error.issues
                .map((issue) => issue.path.join('.'))
                .join('\n');
            console.error(`Missing or invalid environment variables: \n${missingEnvs}`);
            process.exit(1);
        }
        throw error;
    }
}
exports.env = validateEnv();
//# sourceMappingURL=env.js.map