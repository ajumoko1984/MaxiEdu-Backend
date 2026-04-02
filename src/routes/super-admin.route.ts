import express from "express";
import schoolController from "../controllers/school.controller";
import authMiddleware from "../middleware/auth.middleware";
import {
  validateCreateSchool,
  validateUpdateSchool,
} from "../schema/school.schema";
import { ROLE } from "../enums/role.enum";

const router = express.Router();

/**
 * @openapi
 * /api/v1/super-admin/schools:
 *   get:
 *     tags:
 *       - SuperAdmin Schools
 *     summary: Get all schools
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of all schools
 *       401:
 *         description: Unauthorized
 */
router.get(
  "/schools",
  authMiddleware.auth([ROLE.SUPER_ADMIN]),
  schoolController.getAllSchools
);

/**
 * @openapi
 * /api/v1/super-admin/schools:
 *   post:
 *     tags:
 *       - SuperAdmin Schools
 *     summary: Create a new school
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, email, phone]
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               phone:
 *                 type: string
 *               address:
 *                 type: string
 *     responses:
 *       201:
 *         description: School created
 *       400:
 *         description: Validation error
 */
router.post(
  "/schools",
  authMiddleware.auth([ROLE.SUPER_ADMIN]),
  validateCreateSchool,
  schoolController.createSchool
);

/**
 * @openapi
 * /api/v1/super-admin/schools/{id}:
 *   get:
 *     tags:
 *       - SuperAdmin Schools
 *     summary: Get school by ID
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
 *         description: School details
 *       404:
 *         description: School not found
 */
router.get(
  "/schools/:id",
  authMiddleware.auth([ROLE.SUPER_ADMIN]),
  schoolController.getSchoolById
);

/**
 * @openapi
 * /api/v1/super-admin/schools/{id}:
 *   put:
 *     tags:
 *       - SuperAdmin Schools
 *     summary: Update school
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               phone:
 *                 type: string
 *               address:
 *                 type: string
 *     responses:
 *       200:
 *         description: School updated
 *       404:
 *         description: School not found
 */
router.put(
  "/schools/:id",
  authMiddleware.auth([ROLE.SUPER_ADMIN]),
  validateUpdateSchool,
  schoolController.updateSchool
);

/**
 * @openapi
 * /api/v1/super-admin/schools/{id}:
 *   delete:
 *     tags:
 *       - SuperAdmin Schools
 *     summary: Delete school
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
 *         description: School deleted
 *       404:
 *         description: School not found
 */
router.delete(
  "/schools/:id",
  authMiddleware.auth([ROLE.SUPER_ADMIN]),
  schoolController.deleteSchool
);

/**
 * @openapi
 * /api/v1/super-admin/overview:
 *   get:
 *     tags:
 *       - SuperAdmin Schools
 *     summary: Get platform overview statistics
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Platform statistics
 *       401:
 *         description: Unauthorized
 */
router.get(
  "/overview",
  authMiddleware.auth([ROLE.SUPER_ADMIN]),
  schoolController.getPlatformOverview
);

export default router;
