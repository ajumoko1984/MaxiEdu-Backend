"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.bindUserRoutes = void 0;
const auth_route_1 = __importDefault(require("./auth.route"));
const super_admin_route_1 = __importDefault(require("./super-admin.route"));
const admin_route_1 = __importDefault(require("./admin.route"));
const bindUserRoutes = (app) => {
    app.use("/api/v1/auth", auth_route_1.default);
    console.log(" Auth routes bound at /api/v1/auth");
    app.use("/api/v1/super-admin", super_admin_route_1.default);
    console.log(" Super Admin routes bound at /api/v1/super-admin");
    app.use("/api/v1/admin", admin_route_1.default);
    console.log(" Admin routes bound at /api/v1/admin");
};
exports.bindUserRoutes = bindUserRoutes;
//# sourceMappingURL=index.js.map