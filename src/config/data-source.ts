import { DataSource } from "typeorm";
import { User } from "../entities/user.entity";
import { School } from "../entities/school.entity";
import { Teacher } from "../entities/teacher.entity";
import { Student } from "../entities/student.entity";
import { Class } from "../entities/class.entity";
import { Subject } from "../entities/subject.entity";
import { Dorm } from "../entities/dorm.entity";
import { Transport } from "../entities/transport.entity";
import { DB_HOST, DB_NAME, DB_PASSWORD, DB_PORT, DB_USER } from "./env.config";

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
    Transport
  ],
  synchronize: true,
  logging: false,
});
