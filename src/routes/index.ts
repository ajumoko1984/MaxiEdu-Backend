import { Express } from "express";
// import user from "./user.route";
import auth from "./auth.route";
import superAdmin from "./super-admin.route";
import admin from "./admin.route";

export const bindUserRoutes = (app: Express): void => {
  app.use("/api/v1/auth", auth);
  console.log(" Auth routes bound at /api/v1/auth");
  
  app.use("/api/v1/super-admin", superAdmin);
  console.log(" Super Admin routes bound at /api/v1/super-admin");

  app.use("/api/v1/admin/schools", admin);
  console.log(" Admin routes bound at /api/v1/admin");
};
