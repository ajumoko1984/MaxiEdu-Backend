"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.init = void 0;
require("reflect-metadata");
const app_1 = require("../app");
const logger_1 = __importDefault(require("../utils/logger"));
const env_config_1 = require("../config/env.config");
const data_source_1 = require("../config/data-source");
const constants_1 = require("../config/constants");
const routes_1 = require("../routes");
require("../env");
const logger = new logger_1.default("general", constants_1.Namespaces.Entry);
const name = "School Management System";
const init = () => (0, app_1.createApp)(routes_1.bindUserRoutes, name);
exports.init = init;
const app = (0, exports.init)();
const port = process.env.PORT || env_config_1.APP_PORT || 3000;
app.listen(port, () => {
    logger.info(`User Server started successfully on ${port}`);
});
data_source_1.AppDataSource.initialize()
    .then(() => {
    logger.info("Data Source has been initialized!");
})
    .catch((err) => {
    logger.error("Error during Data Source initialization:", err);
});
//# sourceMappingURL=server.js.map