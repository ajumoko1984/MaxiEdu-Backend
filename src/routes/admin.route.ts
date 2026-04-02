import { Router } from "express";
import adminController from "../controllers/admin.controller";
import teacherController from "../controllers/teacher.controller";
import studentsController from "../controllers/students.controller";
import authMiddleware from "../middleware/auth.middleware";
import { ROLE } from "../enums/role.enum";
import {
  
  validateAddTransportRoute,
  
  validateAddMaterial,
  validateCreateSetting,
  validateSchoolId,
  validateIdParam
} from "../schema/admin.schema";
import parentsController from "../controllers/parents.controller";
import classesController from "../controllers/classes.controller";
import sessionsExamsController from "../controllers/sessions.exams.controller";
import subjectController from "../controllers/subject.controller";
import dormController from "../controllers/dorm.controller";
import attendanceController from "../controllers/attendance.controller";
import materialsController from "../controllers/materials.controller";
import scoresController from "../controllers/scores.controller";
import gradesController from "../controllers/grades.controller";
import settingsController from "../controllers/settings.controller";
import alumniController from "../controllers/alumni.controller";

// Repos for ownership checks
import teacherRepository from "../repository/teacher.repository";
import studentRepository from "../repository/student.repository";
import classRepository from "../repository/class.repository";
import subjectRepository from "../repository/subject.repository";
import parentRepository from "../repository/parent.repository";
import sessionRepository from "../repository/session.repository";
import examRepository from "../repository/exam.repository";
import attendanceRepository from "../repository/attendance.repository";
import materialRepository from "../repository/material.repository";
import scoreRepository from "../repository/score.repository";
import gradeRepository from "../repository/grade.repository";
import alumniRepository from "../repository/alumni.repository";
import settingRepository from "../repository/setting.repository";
import libraryController from "../controllers/library.controller";
import timetableController from "../controllers/timetable.controller";

import { ensureSchoolExists, ensureResourceBelongsToSchool } from "../middleware/ownership.middleware";
import fileUploader from "../middleware/fileUploader.middleware";
import {getProfileImage, uploadProfileImage} from "../controllers/uploadProfileImage.controller";

import { validateAddTeacher } from "../schema/admin/teacher.schema";
import { validateAddStudent } from "../schema/admin/student.schema";
import { validateCreateClass } from "../schema/admin/class.schema";
import { validateAddSubject } from "../schema/admin/subject.schema";
import { validateAddParent } from "../schema/admin/parent.schema";
import { validateAddDorm } from "../schema/admin/dorm.schema";
import { validateCreateExam, validateCreateSession } from "../schema/admin/session.exam.schma";
import { validateCreateLibrary } from "../schema/admin/library.schema";
import { validateCreateTimetable } from "../schema/admin/timetable.schema";
import { validateAddScore } from "../schema/admin/score.schema";
import { validateAddGrade } from "../schema/admin/grade.schema";
import { validateAddAlumni } from "../schema/admin/alumni.schema";
import faceVerificationController from "../controllers/faceVerification.controller";
import { validateFaceEnroll, validateFaceVerify } from "../schema/admin/faceVerification.schema";
import rfidController from "../controllers/rfid.controller";
import { validateMarkAttendance } from "../schema/admin/attendance.schema";

const router = Router();

// Validate :schoolId format and ensure school exists for any route with :schoolId
router.use("/:schoolId", validateSchoolId, ensureSchoolExists);

/**
 * @openapi
 * /api/v1/admin/schools/{schoolId}/dashboard:
 *   get:
 *     tags:
 *       - Admin Dashboard
 *     summary: Get admin dashboard data
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: schoolId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Dashboard data
 *       401:
 *         description: Unauthorized
 */
router.get("/:schoolId/dashboard", authMiddleware.auth([ROLE.ADMIN]), adminController.getDashboard);

/**
 * @openapi
 * /api/v1/admin/schools/{schoolId}/uploadImage/{entityType}/{entityId}/{imageType}:
 *   post:
 *     tags:
 *       - Admin Media
 *     summary: Upload profile image
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: schoolId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: entityType
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: entityId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: imageType
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Image uploaded
 *       400:
 *         description: Upload error
 */
router.post("/:schoolId/uploadImage/:entityType/:entityId/:imageType",fileUploader("profileImage"),uploadProfileImage);

/**
 * @openapi
 * /api/v1/admin/schools/{schoolId}/uploadImage/{entityType}/{entityId}/{imageType}:
 *   get:
 *     tags:
 *       - Admin Media
 *     summary: Get profile image
 *     parameters:
 *       - in: path
 *         name: schoolId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: entityType
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: entityId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: imageType
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Image retrieved
 *       404:
 *         description: Image not found
 */
router.get("/:schoolId/uploadImage/:entityType/:entityId/:imageType",getProfileImage);

// RFID Routes
/**
 * @openapi
 * /api/v1/admin/schools/{schoolId}/rfid/assign/{id}:
 *   post:
 *     tags:
 *       - RFID
 *     summary: Assign RFID tag
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: schoolId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: RFID assigned
 *       400:
 *         description: Assignment error
 */
router.post("/:schoolId/rfid/assign/:id", authMiddleware.auth([ROLE.ADMIN]), rfidController.assignRfid.bind(rfidController));

/**
 * @openapi
 * /api/v1/admin/schools/{schoolId}/rfid/verify/{id}:
 *   post:
 *     tags:
 *       - RFID
 *     summary: Verify RFID tag
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: schoolId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: RFID verified
 *       400:
 *         description: Verification error
 */
router.post("/:schoolId/rfid/verify/:id", authMiddleware.auth([ROLE.ADMIN]), rfidController.verifyRfid.bind(rfidController));

/**
 * @openapi
 * /api/v1/admin/schools/{schoolId}/rfid/replace/{id}:
 *   post:
 *     tags:
 *       - RFID
 *     summary: Replace RFID tag
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: schoolId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: RFID replaced
 */
router.post("/:schoolId/rfid/replace/:id", authMiddleware.auth([ROLE.ADMIN]), rfidController.replaceRfid.bind(rfidController));

/**
 * @openapi
 * /api/v1/admin/schools/{schoolId}/rfid/{id}:
 *   get:
 *     tags:
 *       - RFID
 *     summary: Get RFID details
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: schoolId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: RFID details
 */
router.get("/:schoolId/rfid/:id", authMiddleware.auth([ROLE.ADMIN]), rfidController.getRfid.bind(rfidController));

// FaceVerification Routes
/**
 * @openapi
 * /api/v1/admin/schools/{schoolId}/faceVerification/enroll/{id}:
 *   post:
 *     tags:
 *       - FaceVerification
 *     summary: Enroll face for biometric
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: schoolId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Face enrolled
 */
router.post("/:schoolId/faceVerification/enroll/:id", authMiddleware.auth([ROLE.ADMIN]), validateFaceEnroll, faceVerificationController.enrollFace);

/**
 * @openapi
 * /api/v1/admin/schools/{schoolId}/faceVerification/verify/{id}:
 *   post:
 *     tags:
 *       - FaceVerification
 *     summary: Verify face
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: schoolId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Face verified
 */
router.post("/:schoolId/faceVerification/verify/:id", authMiddleware.auth([ROLE.ADMIN]), validateFaceVerify, faceVerificationController.verifyFace);

/**
 * @openapi
 * /api/v1/admin/schools/{schoolId}/faceVerification/status/{id}:
 *   get:
 *     tags:
 *       - FaceVerification
 *     summary: Get face verification status
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: schoolId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Face verification status
 */
router.get("/:schoolId/faceVerification/status/:id", authMiddleware.auth([ROLE.ADMIN]), faceVerificationController.getFaceStatus);

// Teachers Routes
/**
 * @openapi
 * /api/v1/admin/schools/{schoolId}/teachers:
 *   post:
 *     tags:
 *       - Teachers
 *     summary: Add a new teacher
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: schoolId
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
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               phone:
 *                 type: string
 *     responses:
 *       201:
 *         description: Teacher added
 */
router.post("/:schoolId/teachers", authMiddleware.auth([ROLE.ADMIN]), validateAddTeacher, teacherController.addTeacher);

/**
 * @openapi
 * /api/v1/admin/schools/{schoolId}/teachers:
 *   get:
 *     tags:
 *       - Teachers
 *     summary: List all teachers
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: schoolId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Teachers list
 */
router.get("/:schoolId/teachers", authMiddleware.auth([ROLE.ADMIN]), teacherController.listTeachers);

/**
 * @openapi
 * /api/v1/admin/schools/{schoolId}/teachers/{id}:
 *   get:
 *     tags:
 *       - Teachers
 *     summary: Get teacher by ID
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: schoolId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Teacher details
 */
router.get("/:schoolId/teachers/:id", authMiddleware.auth([ROLE.ADMIN]),  ensureResourceBelongsToSchool(teacherRepository), teacherController.getTeacher);

/**
 * @openapi
 * /api/v1/admin/schools/{schoolId}/teachers/{id}:
 *   put:
 *     tags:
 *       - Teachers
 *     summary: Update teacher
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: schoolId
 *         required: true
 *         schema:
 *           type: string
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
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               phone:
 *                 type: string
 *     responses:
 *       200:
 *         description: Teacher updated
 */
router.put("/:schoolId/teachers/:id", authMiddleware.auth([ROLE.ADMIN]),  ensureResourceBelongsToSchool(teacherRepository), teacherController.updateTeacher);

/**
 * @openapi
 * /api/v1/admin/schools/{schoolId}/teachers/{id}:
 *   delete:
 *     tags:
 *       - Teachers
 *     summary: Delete teacher
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: schoolId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Teacher deleted
 */
router.delete("/:schoolId/teachers/:id", authMiddleware.auth([ROLE.ADMIN]),  ensureResourceBelongsToSchool(teacherRepository), teacherController.deleteTeacher);

// Students Routes
/**
 * @openapi
 * /api/v1/admin/schools/{schoolId}/students:
 *   post:
 *     tags:
 *       - Students
 *     summary: Add a new student
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: schoolId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       201:
 *         description: Student added
 */
router.post("/:schoolId/students", authMiddleware.auth([ROLE.ADMIN]), validateAddStudent, studentsController.addStudent);

/**
 * @openapi
 * /api/v1/admin/schools/{schoolId}/students:
 *   get:
 *     tags:
 *       - Students
 *     summary: List all students
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: schoolId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Students list
 */
router.get("/:schoolId/students", authMiddleware.auth([ROLE.ADMIN]), studentsController.listStudents);

/**
 * @openapi
 * /api/v1/admin/schools/{schoolId}/students/{id}:
 *   get:
 *     tags:
 *       - Students
 *     summary: Get student by ID
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: schoolId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Student details
 */
router.get("/:schoolId/students/:id", authMiddleware.auth([ROLE.ADMIN]),ensureResourceBelongsToSchool(studentRepository), studentsController.getStudent);

/**
 * @openapi
 * /api/v1/admin/schools/{schoolId}/students/{id}:
 *   put:
 *     tags:
 *       - Students
 *     summary: Update student
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: schoolId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Student updated
 */
router.put("/:schoolId/students/:id", authMiddleware.auth([ROLE.ADMIN]),  ensureResourceBelongsToSchool(studentRepository), studentsController.updateStudent);

/**
 * @openapi
 * /api/v1/admin/schools/{schoolId}/students/{id}:
 *   delete:
 *     tags:
 *       - Students
 *     summary: Delete student
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: schoolId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Student deleted
 */
router.delete("/:schoolId/students/:id", authMiddleware.auth([ROLE.ADMIN]),  ensureResourceBelongsToSchool(studentRepository), studentsController.deleteStudent);

// Parents Routes
/**
 * @openapi
 * /api/v1/admin/schools/{schoolId}/parents:
 *   post:
 *     tags:
 *       - Parents
 *     summary: Add a new parent
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: schoolId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       201:
 *         description: Parent added
 */
router.post("/:schoolId/parents", authMiddleware.auth([ROLE.ADMIN]), validateAddParent, parentsController.addParent);

/**
 * @openapi
 * /api/v1/admin/schools/{schoolId}/parents:
 *   get:
 *     tags:
 *       - Parents
 *     summary: List all parents
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: schoolId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Parents list
 */
router.get("/:schoolId/parents", authMiddleware.auth([ROLE.ADMIN]), parentsController.listParents);

/**
 * @openapi
 * /api/v1/admin/schools/{schoolId}/parents/{id}:
 *   get:
 *     tags:
 *       - Parents
 *     summary: Get parent by ID
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: schoolId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Parent details
 */
router.get("/:schoolId/parents/:id", authMiddleware.auth([ROLE.ADMIN]),  ensureResourceBelongsToSchool(parentRepository), parentsController.getParent);

/**
 * @openapi
 * /api/v1/admin/schools/{schoolId}/parents/{id}:
 *   put:
 *     tags:
 *       - Parents
 *     summary: Update parent
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: schoolId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Parent updated
 */
router.put("/:schoolId/parents/:id", authMiddleware.auth([ROLE.ADMIN]),  ensureResourceBelongsToSchool(parentRepository), parentsController.updateParent);

/**
 * @openapi
 * /api/v1/admin/schools/{schoolId}/parents/{id}:
 *   delete:
 *     tags:
 *       - Parents
 *     summary: Delete parent
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: schoolId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Parent deleted
 */
router.delete("/:schoolId/parents/:id", authMiddleware.auth([ROLE.ADMIN]),  ensureResourceBelongsToSchool(parentRepository), parentsController.deleteParent);

// Classes Routes
/**
 * @openapi
 * /api/v1/admin/schools/{schoolId}/classes:
 *   post:
 *     tags:
 *       - Classes
 *     summary: Create a new class
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: schoolId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       201:
 *         description: Class created
 */
router.post("/:schoolId/classes", authMiddleware.auth([ROLE.ADMIN]), validateCreateClass, classesController.createClass);

/**
 * @openapi
 * /api/v1/admin/schools/{schoolId}/classes:
 *   get:
 *     tags:
 *       - Classes
 *     summary: List all classes
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: schoolId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Classes list
 */
router.get("/:schoolId/classes", authMiddleware.auth([ROLE.ADMIN]), classesController.listClasses);

/**
 * @openapi
 * /api/v1/admin/schools/{schoolId}/classes/{id}:
 *   get:
 *     tags:
 *       - Classes
 *     summary: Get class by ID
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: schoolId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Class details
 */
router.get("/:schoolId/classes/:id", authMiddleware.auth([ROLE.ADMIN]), classesController.getClass);

/**
 * @openapi
 * /api/v1/admin/schools/{schoolId}/classes/{id}:
 *   put:
 *     tags:
 *       - Classes
 *     summary: Update class
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: schoolId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Class updated
 */
router.put("/:schoolId/classes/:id", authMiddleware.auth([ROLE.ADMIN]), classesController.updateClass);

/**
 * @openapi
 * /api/v1/admin/schools/{schoolId}/classes/{id}:
 *   delete:
 *     tags:
 *       - Classes
 *     summary: Delete class
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: schoolId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Class deleted
 */
router.delete("/:schoolId/classes/:id", authMiddleware.auth([ROLE.ADMIN]), classesController.deleteClass);

// Subjects Routes
/**
 * @openapi
 * /api/v1/admin/schools/{schoolId}/subjects:
 *   post:
 *     tags:
 *       - Subjects
 *     summary: Add a new subject
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: schoolId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       201:
 *         description: Subject added
 */
router.post("/:schoolId/subjects", authMiddleware.auth([ROLE.ADMIN]), validateAddSubject, subjectController.addSubject);

/**
 * @openapi
 * /api/v1/admin/schools/{schoolId}/subjects:
 *   get:
 *     tags:
 *       - Subjects
 *     summary: List all subjects
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: schoolId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Subjects list
 */
router.get("/:schoolId/subjects", authMiddleware.auth([ROLE.ADMIN]), subjectController.listSubjects);

/**
 * @openapi
 * /api/v1/admin/schools/{schoolId}/subjects/{id}:
 *   get:
 *     tags:
 *       - Subjects
 *     summary: Get subject by ID
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: schoolId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Subject details
 */
router.get("/:schoolId/subjects/:id", authMiddleware.auth([ROLE.ADMIN]),  ensureResourceBelongsToSchool(subjectRepository), subjectController.getSubject);

/**
 * @openapi
 * /api/v1/admin/schools/{schoolId}/subjects/{classId}:
 *   get:
 *     tags:
 *       - Subjects
 *     summary: Get subjects by class
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: schoolId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: classId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Subjects for class
 */
router.get("/:schoolId/subjects/:classId", authMiddleware.auth([ROLE.ADMIN]), ensureResourceBelongsToSchool(subjectRepository), subjectController.getSubjectsByClass);

/**
 * @openapi
 * /api/v1/admin/schools/{schoolId}/subjects/{id}:
 *   put:
 *     tags:
 *       - Subjects
 *     summary: Update subject
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: schoolId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Subject updated
 */
router.put("/:schoolId/subjects/:id", authMiddleware.auth([ROLE.ADMIN]),  ensureResourceBelongsToSchool(subjectRepository),  subjectController.updateSubject);

/**
 * @openapi
 * /api/v1/admin/schools/{schoolId}/subjects/{id}:
 *   delete:
 *     tags:
 *       - Subjects
 *     summary: Delete subject
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: schoolId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Subject deleted
 */
router.delete("/:schoolId/subjects/:id", authMiddleware.auth([ROLE.ADMIN]),  ensureResourceBelongsToSchool(subjectRepository), subjectController.deleteSubject);

// Sessions & Exams Routes
/**
 * @openapi
 * /api/v1/admin/schools/{schoolId}/sessions:
 *   post:
 *     tags:
 *       - Sessions & Exams
 *     summary: Create a new session
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: schoolId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       201:
 *         description: Session created
 */
router.post("/:schoolId/sessions", authMiddleware.auth([ROLE.ADMIN]), validateCreateSession, sessionsExamsController.createSession);

/**
 * @openapi
 * /api/v1/admin/schools/{schoolId}/sessions:
 *   get:
 *     tags:
 *       - Sessions & Exams
 *     summary: List all sessions
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: schoolId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Sessions list
 */
router.get("/:schoolId/sessions", authMiddleware.auth([ROLE.ADMIN]), sessionsExamsController.listSessions);

/**
 * @openapi
 * /api/v1/admin/schools/{schoolId}/sessions/{id}:
 *   get:
 *     tags:
 *       - Sessions & Exams
 *     summary: Get session by ID
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: schoolId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Session details
 */
router.get("/:schoolId/sessions/:id", authMiddleware.auth([ROLE.ADMIN]), sessionsExamsController.getSession);

/**
 * @openapi
 * /api/v1/admin/schools/{schoolId}/sessions/{id}:
 *   put:
 *     tags:
 *       - Sessions & Exams
 *     summary: Update session
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: schoolId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Session updated
 */
router.put("/:schoolId/sessions/:id", authMiddleware.auth([ROLE.ADMIN]),   sessionsExamsController.updateSession);

/**
 * @openapi
 * /api/v1/admin/schools/{schoolId}/sessions/{id}:
 *   delete:
 *     tags:
 *       - Sessions & Exams
 *     summary: Delete session
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: schoolId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Session deleted
 */
router.delete("/:schoolId/sessions/:id", authMiddleware.auth([ROLE.ADMIN]),   sessionsExamsController.deleteSession);

/**
 * @openapi
 * /api/v1/admin/schools/{schoolId}/exams:
 *   post:
 *     tags:
 *       - Sessions & Exams
 *     summary: Create a new exam
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: schoolId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       201:
 *         description: Exam created
 */
router.post("/:schoolId/exams", authMiddleware.auth([ROLE.ADMIN]), validateCreateExam, sessionsExamsController.createExam);

/**
 * @openapi
 * /api/v1/admin/schools/{schoolId}/exams:
 *   get:
 *     tags:
 *       - Sessions & Exams
 *     summary: List all exams
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: schoolId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Exams list
 */
router.get("/:schoolId/exams", authMiddleware.auth([ROLE.ADMIN]), sessionsExamsController.listExams);

/**
 * @openapi
 * /api/v1/admin/schools/{schoolId}/exams/{id}:
 *   get:
 *     tags:
 *       - Sessions & Exams
 *     summary: Get exam by ID
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: schoolId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Exam details
 */
router.get("/:schoolId/exams/:id", authMiddleware.auth([ROLE.ADMIN]), sessionsExamsController.getExam);

/**
 * @openapi
 * /api/v1/admin/schools/{schoolId}/exams/{id}:
 *   put:
 *     tags:
 *       - Sessions & Exams
 *     summary: Update exam
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: schoolId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Exam updated
 */
router.put("/:schoolId/exams/:id", authMiddleware.auth([ROLE.ADMIN]), sessionsExamsController.updateExam);

/**
 * @openapi
 * /api/v1/admin/schools/{schoolId}/exams/{id}:
 *   delete:
 *     tags:
 *       - Sessions & Exams
 *     summary: Delete exam
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: schoolId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Exam deleted
 */
router.delete("/:schoolId/exams/:id", authMiddleware.auth([ROLE.ADMIN]), sessionsExamsController.deleteExam);

// Attendance Routes
/**
 * @openapi
 * /api/v1/admin/schools/{schoolId}/attendance:
 *   post:
 *     tags:
 *       - Attendance
 *     summary: Mark attendance
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: schoolId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       201:
 *         description: Attendance marked
 */
router.post("/:schoolId/attendance", authMiddleware.auth([ROLE.ADMIN]), validateMarkAttendance, attendanceController.markAttendance);

/**
 * @openapi
 * /api/v1/admin/schools/{schoolId}/attendance/{id}:
 *   put:
 *     tags:
 *       - Attendance
 *     summary: Update attendance
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: schoolId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Attendance updated
 */
router.put("/:schoolId/attendance/:id", authMiddleware.auth([ROLE.ADMIN]), attendanceController.updateAttendance);

/**
 * @openapi
 * /api/v1/admin/schools/{schoolId}/attendance:
 *   get:
 *     tags:
 *       - Attendance
 *     summary: List all attendance records
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: schoolId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Attendance records
 */
router.get("/:schoolId/attendance", authMiddleware.auth([ROLE.ADMIN]), attendanceController.listAttendance);

/**
 * @openapi
 * /api/v1/admin/schools/{schoolId}/attendance/{id}:
 *   get:
 *     tags:
 *       - Attendance
 *     summary: Get attendance by ID
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: schoolId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Attendance details
 */
router.get("/:schoolId/attendance/:id", authMiddleware.auth([ROLE.ADMIN]), attendanceController.getAttendance);

// Materials Routes
/**
 * @openapi
 * /api/v1/admin/schools/{schoolId}/materials:
 *   post:
 *     tags:
 *       - Materials
 *     summary: Add a new material
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: schoolId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       201:
 *         description: Material added
 */
router.post("/:schoolId/materials", authMiddleware.auth([ROLE.ADMIN]), validateAddMaterial, materialsController.addMaterial);

/**
 * @openapi
 * /api/v1/admin/schools/{schoolId}/materials:
 *   get:
 *     tags:
 *       - Materials
 *     summary: List all materials
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: schoolId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Materials list
 */
router.get("/:schoolId/materials", authMiddleware.auth([ROLE.ADMIN]), materialsController.listMaterials);

/**
 * @openapi
 * /api/v1/admin/schools/{schoolId}/materials/{id}:
 *   get:
 *     tags:
 *       - Materials
 *     summary: Get material by ID
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: schoolId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Material details
 */
router.get("/:schoolId/materials/:id", authMiddleware.auth([ROLE.ADMIN]),  ensureResourceBelongsToSchool(materialRepository), materialsController.getMaterial);

/**
 * @openapi
 * /api/v1/admin/schools/{schoolId}/materials/{id}:
 *   put:
 *     tags:
 *       - Materials
 *     summary: Update material
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: schoolId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Material updated
 */
router.put("/:schoolId/materials/:id", authMiddleware.auth([ROLE.ADMIN]),  ensureResourceBelongsToSchool(materialRepository), materialsController.updateMaterial);

/**
 * @openapi
 * /api/v1/admin/schools/{schoolId}/materials/{id}:
 *   delete:
 *     tags:
 *       - Materials
 *     summary: Delete material
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: schoolId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Material deleted
 */
router.delete("/:schoolId/materials/:id", authMiddleware.auth([ROLE.ADMIN]),  ensureResourceBelongsToSchool(materialRepository), materialsController.deleteMaterial);

// Scores Routes
/**
 * @openapi
 * /api/v1/admin/schools/{schoolId}/scores:
 *   post:
 *     tags:
 *       - Scores
 *     summary: Add a new score
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: schoolId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       201:
 *         description: Score added
 */
router.post("/:schoolId/scores", authMiddleware.auth([ROLE.ADMIN]), validateAddScore, scoresController.addScore);

/**
 * @openapi
 * /api/v1/admin/schools/{schoolId}/scores/student/{studentId}:
 *   get:
 *     tags:
 *       - Scores
 *     summary: Get scores by student
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: schoolId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: studentId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Student scores
 */
router.get("/:schoolId/scores/student/:studentId", authMiddleware.auth([ROLE.ADMIN]), validateIdParam("studentId"), ensureResourceBelongsToSchool(studentRepository, "studentId"), scoresController.listScoresByStudent);

/**
 * @openapi
 * /api/v1/admin/schools/{schoolId}/scores/{id}:
 *   get:
 *     tags:
 *       - Scores
 *     summary: Get score by ID
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: schoolId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Score details
 */
router.get("/:schoolId/scores/:id", authMiddleware.auth([ROLE.ADMIN]),  ensureResourceBelongsToSchool(scoreRepository), scoresController.getScore);

/**
 * @openapi
 * /api/v1/admin/schools/{schoolId}/scores/{id}:
 *   put:
 *     tags:
 *       - Scores
 *     summary: Update score
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: schoolId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Score updated
 */
router.put("/:schoolId/scores/:id", authMiddleware.auth([ROLE.ADMIN]),  ensureResourceBelongsToSchool(scoreRepository), scoresController.updateScore);

/**
 * @openapi
 * /api/v1/admin/schools/{schoolId}/scores/{id}:
 *   delete:
 *     tags:
 *       - Scores
 *     summary: Delete score
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: schoolId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Score deleted
 */
router.delete("/:schoolId/scores/:id", authMiddleware.auth([ROLE.ADMIN]),  ensureResourceBelongsToSchool(scoreRepository), scoresController.deleteScore);

// Grades Routes
/**
 * @openapi
 * /api/v1/admin/schools/{schoolId}/grades:
 *   post:
 *     tags:
 *       - Grades
 *     summary: Add a new grade
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: schoolId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       201:
 *         description: Grade added
 */
router.post("/:schoolId/grades", authMiddleware.auth([ROLE.ADMIN]), validateAddGrade, gradesController.addGrade);

/**
 * @openapi
 * /api/v1/admin/schools/{schoolId}/grades:
 *   get:
 *     tags:
 *       - Grades
 *     summary: List all grades
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: schoolId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Grades list
 */
router.get("/:schoolId/grades", authMiddleware.auth([ROLE.ADMIN]), gradesController.listGrades);

/**
 * @openapi
 * /api/v1/admin/schools/{schoolId}/grades/{id}:
 *   get:
 *     tags:
 *       - Grades
 *     summary: Get grade by ID
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: schoolId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Grade details
 */
router.get("/:schoolId/grades/:id", authMiddleware.auth([ROLE.ADMIN]), gradesController.getGrade);

/**
 * @openapi
 * /api/v1/admin/schools/{schoolId}/grades/{id}:
 *   put:
 *     tags:
 *       - Grades
 *     summary: Update grade
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: schoolId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Grade updated
 */
router.put("/:schoolId/grades/:id", authMiddleware.auth([ROLE.ADMIN]),   gradesController.updateGrade);

/**
 * @openapi
 * /api/v1/admin/schools/{schoolId}/grades/{id}:
 *   delete:
 *     tags:
 *       - Grades
 *     summary: Delete grade
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: schoolId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Grade deleted
 */
router.delete("/:schoolId/grades/:id", authMiddleware.auth([ROLE.ADMIN]),  gradesController.deleteGrade);

// Settings Routes
/**
 * @openapi
 * /api/v1/admin/schools/{schoolId}/settings:
 *   post:
 *     tags:
 *       - Settings
 *     summary: Create a new setting
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: schoolId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       201:
 *         description: Setting created
 */
router.post("/:schoolId/settings", authMiddleware.auth([ROLE.ADMIN]), validateCreateSetting, settingsController.createSetting);

/**
 * @openapi
 * /api/v1/admin/schools/{schoolId}/settings:
 *   get:
 *     tags:
 *       - Settings
 *     summary: List all settings
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: schoolId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Settings list
 */
router.get("/:schoolId/settings", authMiddleware.auth([ROLE.ADMIN]), settingsController.listSettings);

/**
 * @openapi
 * /api/v1/admin/schools/{schoolId}/settings/{id}:
 *   get:
 *     tags:
 *       - Settings
 *     summary: Get setting by ID
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: schoolId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Setting details
 */
router.get("/:schoolId/settings/:id", authMiddleware.auth([ROLE.ADMIN]),  ensureResourceBelongsToSchool(settingRepository), settingsController.getSetting);

/**
 * @openapi
 * /api/v1/admin/schools/{schoolId}/settings/{id}:
 *   put:
 *     tags:
 *       - Settings
 *     summary: Update setting
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: schoolId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Setting updated
 */
router.put("/:schoolId/settings/:id", authMiddleware.auth([ROLE.ADMIN]),  ensureResourceBelongsToSchool(settingRepository), settingsController.updateSetting);

/**
 * @openapi
 * /api/v1/admin/schools/{schoolId}/settings/{id}:
 *   delete:
 *     tags:
 *       - Settings
 *     summary: Delete setting
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: schoolId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Setting deleted
 */
router.delete("/:schoolId/settings/:id", authMiddleware.auth([ROLE.ADMIN]),  ensureResourceBelongsToSchool(settingRepository), settingsController.deleteSetting);

// Alumni Routes
/**
 * @openapi
 * /api/v1/admin/schools/{schoolId}/alumni:
 *   post:
 *     tags:
 *       - Alumni
 *     summary: Add a new alumni
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: schoolId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       201:
 *         description: Alumni added
 */
router.post("/:schoolId/alumni", authMiddleware.auth([ROLE.ADMIN]), validateAddAlumni, alumniController.addAlumni);

/**
 * @openapi
 * /api/v1/admin/schools/{schoolId}/alumni:
 *   get:
 *     tags:
 *       - Alumni
 *     summary: List all alumni
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: schoolId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Alumni list
 */
router.get("/:schoolId/alumni", authMiddleware.auth([ROLE.ADMIN]), alumniController.listAlumni);

/**
 * @openapi
 * /api/v1/admin/schools/{schoolId}/alumni/{id}:
 *   get:
 *     tags:
 *       - Alumni
 *     summary: Get alumni by ID
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: schoolId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Alumni details
 */
router.get("/:schoolId/alumni/:id", authMiddleware.auth([ROLE.ADMIN]),  ensureResourceBelongsToSchool(alumniRepository), alumniController.getAlumni);

/**
 * @openapi
 * /api/v1/admin/schools/{schoolId}/alumni/{id}:
 *   put:
 *     tags:
 *       - Alumni
 *     summary: Update alumni
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: schoolId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Alumni updated
 */
router.put("/:schoolId/alumni/:id", authMiddleware.auth([ROLE.ADMIN]),  ensureResourceBelongsToSchool(alumniRepository), validateAddAlumni, alumniController.updateAlumni);

/**
 * @openapi
 * /api/v1/admin/schools/{schoolId}/alumni/{id}:
 *   delete:
 *     tags:
 *       - Alumni
 *     summary: Delete alumni
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: schoolId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Alumni deleted
 */
router.delete("/:schoolId/alumni/:id", authMiddleware.auth([ROLE.ADMIN]),  ensureResourceBelongsToSchool(alumniRepository), alumniController.deleteAlumni);

// Dorms Routes
/**
 * @openapi
 * /api/v1/admin/schools/{schoolId}/dorms:
 *   post:
 *     tags:
 *       - Dorms
 *     summary: Add a new dorm
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: schoolId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       201:
 *         description: Dorm added
 */
router.post("/:schoolId/dorms", authMiddleware.auth([ROLE.ADMIN]), validateAddDorm, dormController.addDorm);

// Transport Routes Routes
/**
 * @openapi
 * /api/v1/admin/schools/{schoolId}/transport-routes:
 *   post:
 *     tags:
 *       - Transport
 *     summary: Add a new transport route
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: schoolId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       201:
 *         description: Transport route added
 */
router.post("/:schoolId/transport-routes", authMiddleware.auth([ROLE.ADMIN]), validateAddTransportRoute, adminController.addTransportRoute);

// Library Routes
/**
 * @openapi
 * /api/v1/admin/schools/{schoolId}/library:
 *   post:
 *     tags:
 *       - Library
 *     summary: Add a library book
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: schoolId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       201:
 *         description: Book added
 */
router.post("/:schoolId/library", authMiddleware.auth([ROLE.ADMIN]), validateCreateLibrary, libraryController.addLibrary);

/**
 * @openapi
 * /api/v1/admin/schools/{schoolId}/library:
 *   get:
 *     tags:
 *       - Library
 *     summary: List library books
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: schoolId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Library books list
 */
router.get("/:schoolId/library", authMiddleware.auth([ROLE.ADMIN]), libraryController.listLibrary);

/**
 * @openapi
 * /api/v1/admin/schools/{schoolId}/library/{id}:
 *   get:
 *     tags:
 *       - Library
 *     summary: Get library book by ID
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: schoolId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Book details
 */
router.get("/:schoolId/library/:id", authMiddleware.auth([ROLE.ADMIN]), libraryController.getLibrary);

/**
 * @openapi
 * /api/v1/admin/schools/{schoolId}/library/{id}:
 *   put:
 *     tags:
 *       - Library
 *     summary: Update library book
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: schoolId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Book updated
 */
router.put("/:schoolId/library/:id", authMiddleware.auth([ROLE.ADMIN]), libraryController.updateLibrary);

/**
 * @openapi
 * /api/v1/admin/schools/{schoolId}/library/{id}:
 *   delete:
 *     tags:
 *       - Library
 *     summary: Delete library book
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: schoolId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Book deleted
 */
router.delete("/:schoolId/library/:id", authMiddleware.auth([ROLE.ADMIN]), libraryController.deleteLibrary);

// Timetable Routes
/**
 * @openapi
 * /api/v1/admin/schools/{schoolId}/timetable:
 *   post:
 *     tags:
 *       - Timetable
 *     summary: Create a timetable
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: schoolId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       201:
 *         description: Timetable created
 */
router.post("/:schoolId/timetable", authMiddleware.auth([ROLE.ADMIN]), validateCreateTimetable, timetableController.addTimetable);

/**
 * @openapi
 * /api/v1/admin/schools/{schoolId}/timetable:
 *   get:
 *     tags:
 *       - Timetable
 *     summary: List all timetables
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: schoolId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Timetables list
 */
router.get("/:schoolId/timetable", authMiddleware.auth([ROLE.ADMIN]), timetableController.listTimetable);

/**
 * @openapi
 * /api/v1/admin/schools/{schoolId}/timetable/{id}:
 *   get:
 *     tags:
 *       - Timetable
 *     summary: Get timetable by ID
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: schoolId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Timetable details
 */
router.get("/:schoolId/timetable/:id", authMiddleware.auth([ROLE.ADMIN]), timetableController.getTimetable);

/**
 * @openapi
 * /api/v1/admin/schools/{schoolId}/timetable/{id}:
 *   put:
 *     tags:
 *       - Timetable
 *     summary: Update timetable
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: schoolId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Timetable updated
 */
router.put("/:schoolId/timetable/:id", authMiddleware.auth([ROLE.ADMIN]), timetableController.updateTimetable);

/**
 * @openapi
 * /api/v1/admin/schools/{schoolId}/timetable/{id}:
 *   delete:
 *     tags:
 *       - Timetable
 *     summary: Delete timetable
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: schoolId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Timetable deleted
 */
router.delete("/:schoolId/timetable/:id", authMiddleware.auth([ROLE.ADMIN]), timetableController.deleteTimetable);

export default router;
