import { DataSource } from "typeorm";
import { User } from "../entities/user.entity";
import { DB_HOST, DB_NAME, DB_PASSWORD, DB_PORT, DB_USER } from "./env.config";

export const AppDataSource = new DataSource({
  type: "mysql",
  host: DB_HOST || "127.0.0.1",
  port: Number(DB_PORT) || 3306,
  username: DB_USER,
  password: DB_PASSWORD,
  database: DB_NAME,
  synchronize: true,
  logging: false,
  entities:
    process.env.NODE_ENV === "production"
      ? ["build/entities/**/*.js"]
      : ["src/entities/**/*.ts"],
});
