import { Router } from "express";
import adminController from "../controllers/admin.controller";
import authMiddleware from "../middleware/auth.middleware";
import { ROLE } from "../enums/role.enum";
import {
  validateAddTeacher,
  validateAddStudent,
  validateCreateClass,
  validateAddSubject,
  validateAddDorm,
  validateAddTransportRoute,
} from "../schema/admin.schema";

const router = Router();

// Dashboard
router.get("/dashboard/:schoolId", authMiddleware.auth([ROLE.ADMIN]), adminController.getDashboard);

// Teachers
router.post("/teachers/:schoolId", authMiddleware.auth([ROLE.ADMIN]), validateAddTeacher, adminController.addTeacher);
router.get("/teachers/:schoolId", authMiddleware.auth([ROLE.ADMIN]), adminController.listTeachers);

// Students
router.post("/students/:schoolId", authMiddleware.auth([ROLE.ADMIN]), validateAddStudent, adminController.addStudent);
router.get("/students/:schoolId", authMiddleware.auth([ROLE.ADMIN]), adminController.listStudents);

// Classes
router.post("/classes/:schoolId", authMiddleware.auth([ROLE.ADMIN]), validateCreateClass, adminController.createClass);

// Subjects
router.post("/subjects/:schoolId", authMiddleware.auth([ROLE.ADMIN]), validateAddSubject, adminController.addSubject);

// Dorms
router.post("/dorms/:schoolId", authMiddleware.auth([ROLE.ADMIN]), validateAddDorm, adminController.addDorm);

// Transport Routes
router.post("/transport-routes/:schoolId", authMiddleware.auth([ROLE.ADMIN]), validateAddTransportRoute, adminController.addTransportRoute);

export default router;
