import { DataSource } from "typeorm";
import { User } from "../entities/user.entity";
import { DB_HOST, DB_NAME, DB_PASSWORD, DB_PORT, DB_USER } from "./env.config";

export const AppDataSource = new DataSource({
  type: "mysql",
  host: DB_HOST,
  port: Number(DB_PORT),
  username: DB_USER,
  password: DB_PASSWORD,
  database: DB_NAME,
  entities: [
    User
  ],
  synchronize: true,
  logging: false,
});
