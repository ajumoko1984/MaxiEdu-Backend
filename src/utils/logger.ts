import winston from "winston";

const dateFormat = () => new Date(Date.now()).toUTCString();

// Create a single Winston instance globally
const baseLogger = winston.createLogger({
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(winston.format.colorize()),
      level: "info",
      handleExceptions: true,
    }),
    new winston.transports.File({
      filename: "./logs/general.log",
    }),
  ],
  format: winston.format.printf((info) => {
    return `${dateFormat()} | ${info.level.toUpperCase()} | ${info.message}`;
  }),
  exitOnError: false,
});

class LoggerService {
  private route: string;
  private namespace: string;
  private log_data: any;

  constructor(route: string, namespace: string = "") {
    this.route = route;
    this.namespace = namespace;
    this.log_data = null;
  }

  setLogData(log_data: any) {
    this.log_data = log_data;
  }

  private formatMessage(message: string) {
    let msg = `[${this.namespace}] [${this.route}] ${message}`;
    if (this.log_data) msg += ` | data: ${JSON.stringify(this.log_data)}`;
    return msg;
  }

  async info(message: any, obj: any = undefined) {
    baseLogger.log("info", message, { obj });
  }

  async debug(message: any, obj: any = undefined) {
    baseLogger.log("debug", message, {
      obj,
    });
  }

  async error(message: any, obj: any = undefined) {
    baseLogger.log("error", message, {
      obj,
    });
  }
}

export default LoggerService;
