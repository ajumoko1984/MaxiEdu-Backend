import express from "express";
import authController from "../controllers/auth.controller";
import authMiddleware from "../middleware/auth.middleware";
import { validateForgotPassword, validateProfileUpdate, validateResetPasswordToken, validateUserLogin, validateUserSignup } from "../schema/auth.schema";
import { ROLE } from "../enums/role.enum";


const router = express.Router();

router.post(
  "/register-super-admin",
  validateUserSignup,
  authController.registerSuperAdmin
);

router.post("/login", validateUserLogin, authController.login);
router.post("/logout", authMiddleware.auth(), authController.logout);
router.post(
  "/forgot-password",
  validateForgotPassword,
  authController.forgotPassword
);
router.post(
  "/reset-password",
  validateResetPasswordToken,
  authController.resetPassword
);
router.get("/profile", authMiddleware.auth(), authController.getProfile);
router.put(
  "/profile",
  authMiddleware.auth(),
  validateProfileUpdate,
  authController.updateProfile
);

export default router;
