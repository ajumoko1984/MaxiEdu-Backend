"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = void 0;
const typeorm_1 = require("typeorm");
const env_config_1 = require("./env.config");
exports.AppDataSource = new typeorm_1.DataSource({
    type: "mysql",
    host: env_config_1.DB_HOST || "127.0.0.1",
    port: Number(env_config_1.DB_PORT) || 3306,
    username: env_config_1.DB_USER,
    password: env_config_1.DB_PASSWORD,
    database: env_config_1.DB_NAME,
    synchronize: true,
    logging: false,
    entities: process.env.NODE_ENV === "production"
        ? ["build/entities/**/*.js"]
        : ["src/entities/**/*.ts"],
});
//# sourceMappingURL=data-source.js.map