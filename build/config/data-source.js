"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("../entities/user.entity");
const school_entity_1 = require("../entities/school.entity");
const teacher_entity_1 = require("../entities/teacher.entity");
const student_entity_1 = require("../entities/student.entity");
const class_entity_1 = require("../entities/class.entity");
const subject_entity_1 = require("../entities/subject.entity");
const dorm_entity_1 = require("../entities/dorm.entity");
const transport_entity_1 = require("../entities/transport.entity");
const env_config_1 = require("./env.config");
exports.AppDataSource = new typeorm_1.DataSource({
    type: "mysql",
    host: env_config_1.DB_HOST,
    port: Number(env_config_1.DB_PORT),
    username: env_config_1.DB_USER,
    password: env_config_1.DB_PASSWORD,
    database: env_config_1.DB_NAME,
    entities: [
        user_entity_1.User,
        school_entity_1.School,
        teacher_entity_1.Teacher,
        student_entity_1.Student,
        class_entity_1.Class,
        subject_entity_1.Subject,
        dorm_entity_1.Dorm,
        transport_entity_1.Transport
    ],
    synchronize: true,
    logging: false,
});
//# sourceMappingURL=data-source.js.map