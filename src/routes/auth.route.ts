import express from "express";
import authController from "../controllers/auth.controller";
import authMiddleware from "../middleware/auth.middleware";
import { validateForgotPassword, validateProfileUpdate, validateResetPasswordToken, validateSchoolAdminLogin, validateSchoolAdminSignup, validateUserLogin, validateUserSignup } from "../schema/auth.schema";
import { ROLE } from "../enums/role.enum";
import schoolAuthController from "../controllers/schoolAuth.controller";


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

// School Admin Registration Routes

// Self-register school admin (Option B)
router.post("/registerSchoolAdmin", validateSchoolAdminSignup, schoolAuthController.registerSchoolAdmin);

// Super admin approves admin
router.put(
  "/admin/approve",
  authMiddleware.auth([ROLE.SUPER_ADMIN]),
  schoolAuthController.approveSchoolAdmin
);

router.post(
  "/loginSchoolAdmin",
  validateSchoolAdminLogin,
  schoolAuthController.loginSchoolAdmin
);
// Super admin deactivate
router.put(
  "/admins/:id/deactivate",
  authMiddleware.auth([ROLE.SUPER_ADMIN]),
  schoolAuthController.deactivateSchoolAdmin
);




export default router;
