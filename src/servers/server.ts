import "reflect-metadata";
import { createApp } from "../app";
import Logger from "../utils/logger";
import { APP_PORT } from "../config/env.config";
import { AppDataSource } from "../config/data-source";
import { Namespaces } from "../config/constants";
import { bindUserRoutes } from "../routes";
import "../env";

const logger = new Logger("general", Namespaces.Entry);

const name = "School Management System";

export const init = () => createApp(bindUserRoutes, name);

const app = init();

// Use Render-provided PORT if available
const port = process.env.PORT || APP_PORT || 3000;

app.listen(port, () => {
  logger.info(`User Server started successfully on ${port}`);
});

// Initialize TypeORM Data Source
AppDataSource.initialize()
  .then(() => {
    logger.info("Data Source has been initialized!");
  })
  .catch((err) => {
    logger.error("Error during Data Source initialization:", err);
  });