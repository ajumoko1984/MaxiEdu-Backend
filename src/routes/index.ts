import { Express } from "express";
// import user from "./user.route";
import auth from "./auth.route";

export const bindUserRoutes = (app: Express): void => {
  // app.use("/api/v1/user", user);
  app.use("/api/v1/auth", auth);
  console.log("✅ Auth routes bound at /api/v1/auth");
};
