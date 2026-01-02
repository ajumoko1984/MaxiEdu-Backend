import { DataSource } from "typeorm";
import { User } from "../entities/user.entity";
import { School } from "../entities/school.entity";
import { Teacher } from "../entities/teacher.entity";
import { Student } from "../entities/student.entity";
import { Class } from "../entities/class.entity";
import { Subject } from "../entities/subject.entity";
import { Dorm } from "../entities/dorm.entity";
import { Transport } from "../entities/transport.entity";
import { Parent } from "../entities/parent.entity";
import { Attendance } from "../entities/attendance.entity";
import { Session } from "../entities/session.entity";
import { Exam } from "../entities/exam.entity";
import { Score } from "../entities/score.entity";
import { Grade } from "../entities/grade.entity";
import { Material } from "../entities/material.entity";
import { Setting } from "../entities/setting.entity";
import { Alumni } from "../entities/alumni.entity";
import { DB_HOST, DB_NAME, DB_PASSWORD, DB_PORT, DB_USER } from "./env.config";
import { Library } from "../entities/library.entity";
import { Timetable } from "../entities/timetable.entity";

export const AppDataSource = new DataSource({
  type: "mysql",
  host: DB_HOST,
  port: Number(DB_PORT),
  username: DB_USER,
  password: DB_PASSWORD,
  database: DB_NAME,
  entities: [
    User,
    School,
    Teacher,
    Student,
    Class,
    Subject,
    Dorm,
    Transport,
    Parent,
    Attendance,
    Session,
    Exam,
    Score,
    Grade,
    Material,
    Setting,
    Alumni,
    Library,
    Timetable
  ],
  synchronize: true,
  logging: false,
});
