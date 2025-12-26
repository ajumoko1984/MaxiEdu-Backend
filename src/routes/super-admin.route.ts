import express from "express";
import schoolController from "../controllers/school.controller";
import authMiddleware from "../middleware/auth.middleware";
import {
  validateCreateSchool,
  validateUpdateSchool,
} from "../schema/school.schema";
import { ROLE } from "../enums/role.enum";

const router = express.Router();

router.get(
  "/schools",
  authMiddleware.auth([ROLE.SUPER_ADMIN]),
  schoolController.getAllSchools
);
router.post(
  "/schools",
  authMiddleware.auth([ROLE.SUPER_ADMIN]),
  validateCreateSchool,
  schoolController.createSchool
);
router.get(
  "/schools/:id",
  authMiddleware.auth([ROLE.SUPER_ADMIN]),
  schoolController.getSchoolById
);
router.put(
  "/schools/:id",
  authMiddleware.auth([ROLE.SUPER_ADMIN]),
  validateUpdateSchool,
  schoolController.updateSchool
);
router.delete(
  "/schools/:id",
  authMiddleware.auth([ROLE.SUPER_ADMIN]),
  schoolController.deleteSchool
);
router.get(
  "/overview",
  authMiddleware.auth([ROLE.SUPER_ADMIN]),
  schoolController.getPlatformOverview
);

export default router;
