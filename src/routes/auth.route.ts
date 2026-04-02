import express from "express";
import authController from "../controllers/auth.controller";
import authMiddleware from "../middleware/auth.middleware";
import { validateForgotPassword, validateProfileUpdate, validateResetPasswordToken, validateSchoolAdminLogin, validateSchoolAdminSignup, validateUserLogin, validateUserSignup } from "../schema/auth.schema";
import { ROLE } from "../enums/role.enum";
import schoolAuthController from "../controllers/schoolAuth.controller";


const router = express.Router();

/**
 * @openapi
 * /api/v1/auth/register-super-admin:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Register a super admin user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password, firstName, lastName]
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *     responses:
 *       201:
 *         description: Created
 *       400:
 *         description: Validation error
 */
router.post(
  "/register-super-admin",
  validateUserSignup,
  authController.registerSuperAdmin
);

/**
 * @openapi
 * /api/v1/auth/login:
 *   post:
 *     tags:
 *       - Auth
 *     summary: User login
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Unauthorized
 */
router.post("/login", validateUserLogin, authController.login);

/**
 * @openapi
 * /api/v1/auth/logout:
 *   post:
 *     tags:
 *       - Auth
 *     summary: User logout
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Logged out
 *       401:
 *         description: Unauthorized
 */
router.post("/logout", authMiddleware.auth(), authController.logout);

/**
 * @openapi
 * /api/v1/auth/forgot-password:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Forgot password request
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email]
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *     responses:
 *       200:
 *         description: Reset link sent
 */
router.post(
  "/forgot-password",
  validateForgotPassword,
  authController.forgotPassword
);

/**
 * @openapi
 * /api/v1/auth/reset-password:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Reset password
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [token, password]
 *             properties:
 *               token:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password reset
 */
router.post(
  "/reset-password",
  validateResetPasswordToken,
  authController.resetPassword
);

/**
 * @openapi
 * /api/v1/auth/profile:
 *   get:
 *     tags:
 *       - Auth
 *     summary: Get profile data
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: User profile returned
 *       401:
 *         description: Unauthorized
 */
router.get("/profile", authMiddleware.auth(), authController.getProfile);

/**
 * @openapi
 * /api/v1/auth/profile:
 *   put:
 *     tags:
 *       - Auth
 *     summary: Update user profile
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               phone:
 *                 type: string
 *     responses:
 *       200:
 *         description: Profile updated
 */
router.put(
  "/profile",
  authMiddleware.auth(),
  validateProfileUpdate,
  authController.updateProfile
);

/**
 * @openapi
 * /api/v1/auth/registerSchoolAdmin:
 *   post:
 *     tags:
 *       - SchoolAuth
 *     summary: School admin self-registration
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password, schoolName]
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *               schoolName:
 *                 type: string
 *     responses:
 *       201:
 *         description: Registration request created
 */
router.post("/registerSchoolAdmin", validateSchoolAdminSignup, schoolAuthController.registerSchoolAdmin);

/**
 * @openapi
 * /api/v1/auth/admin/approve:
 *   put:
 *     tags:
 *       - SchoolAuth
 *     summary: Approve school admin (super admin only)
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [adminId]
 *             properties:
 *               adminId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Approved successfully
 *       403:
 *         description: Forbidden
 */
router.put(
  "/admin/approve",
  authMiddleware.auth([ROLE.SUPER_ADMIN]),
  schoolAuthController.approveSchoolAdmin
);

/**
 * @openapi
 * /api/v1/auth/loginSchoolAdmin:
 *   post:
 *     tags:
 *       - SchoolAuth
 *     summary: School admin login
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Unauthorized
 */
router.post(
  "/loginSchoolAdmin",
  validateSchoolAdminLogin,
  schoolAuthController.loginSchoolAdmin
);

/**
 * @openapi
 * /api/v1/auth/admins/{id}/deactivate:
 *   put:
 *     tags:
 *       - SchoolAuth
 *     summary: Deactivate school admin (super admin only)
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Deactivated successfully
 *       404:
 *         description: Admin not found
 */
router.put(
  "/admins/:id/deactivate",
  authMiddleware.auth([ROLE.SUPER_ADMIN]),
  schoolAuthController.deactivateSchoolAdmin
);




export default router;
