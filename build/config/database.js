"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("../entities/user.entity");
const isProd = process.env.NODE_ENV === 'production';
exports.AppDataSource = new typeorm_1.DataSource({
    type: 'mysql',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '3306'),
    username: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME || 'maxiedu',
    synchronize: !isProd,
    logging: !isProd,
    entities: [user_entity_1.User],
    subscribers: [],
    migrations: [],
    ssl: isProd ? {
        rejectUnauthorized: true
    } : undefined,
    extra: isProd ? {
        ssl: {
            rejectUnauthorized: true
        }
    } : undefined
});
//# sourceMappingURL=database.js.map