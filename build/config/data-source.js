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
const parent_entity_1 = require("../entities/parent.entity");
const attendance_entity_1 = require("../entities/attendance.entity");
const session_entity_1 = require("../entities/session.entity");
const exam_entity_1 = require("../entities/exam.entity");
const score_entity_1 = require("../entities/score.entity");
const grade_entity_1 = require("../entities/grade.entity");
const material_entity_1 = require("../entities/material.entity");
const setting_entity_1 = require("../entities/setting.entity");
const alumni_entity_1 = require("../entities/alumni.entity");
const env_config_1 = require("./env.config");
const library_entity_1 = require("../entities/library.entity");
const timetable_entity_1 = require("../entities/timetable.entity");
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
        transport_entity_1.Transport,
        parent_entity_1.Parent,
        attendance_entity_1.Attendance,
        session_entity_1.Session,
        exam_entity_1.Exam,
        score_entity_1.Score,
        grade_entity_1.Grade,
        material_entity_1.Material,
        setting_entity_1.Setting,
        alumni_entity_1.Alumni,
        library_entity_1.Library,
        timetable_entity_1.Timetable
    ],
    synchronize: true,
    logging: false,
});
//# sourceMappingURL=data-source.js.map