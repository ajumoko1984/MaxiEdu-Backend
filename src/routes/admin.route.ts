import { Router } from "express";
import adminController from "../controllers/admin.controller";
import teacherController from "../controllers/teacher.controller";
import studentsController from "../controllers/students.controller";
import authMiddleware from "../middleware/auth.middleware";
import { ROLE } from "../enums/role.enum";
import {
  validateAddTeacher,
  validateAddStudent,
  validateCreateClass,
  validateAddSubject,
  validateAddDorm,
  validateAddTransportRoute,
  validateAddParent,
  validateCreateSession,
  validateCreateExam,
  validateMarkAttendance,
  validateAddMaterial,
  validateAddScore,
  validateAddGrade,
  validateCreateSetting,
  validateAddAlumni,
  validateSchoolId,
  validateIdParam,
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

import { ensureSchoolExists, ensureResourceBelongsToSchool } from "../middleware/ownership.middleware";

const router = Router();

// Validate :schoolId format and ensure school exists for any route with :schoolId
router.use("/:schoolId", validateSchoolId, ensureSchoolExists);

// Dashboard
router.get("/:schoolId/dashboard", authMiddleware.auth([ROLE.ADMIN]), adminController.getDashboard);

// Teachers
router.post("/:schoolId/teachers", authMiddleware.auth([ROLE.ADMIN]), validateAddTeacher, teacherController.addTeacher);
router.get("/:schoolId/teachers", authMiddleware.auth([ROLE.ADMIN]), teacherController.listTeachers);
router.get("/:schoolId/teachers/:id", authMiddleware.auth([ROLE.ADMIN]),  ensureResourceBelongsToSchool(teacherRepository), teacherController.getTeacher);
router.put("/:schoolId/teachers/:id", authMiddleware.auth([ROLE.ADMIN]),  ensureResourceBelongsToSchool(teacherRepository), teacherController.updateTeacher);
router.delete("/:schoolId/teachers/:id", authMiddleware.auth([ROLE.ADMIN]),  ensureResourceBelongsToSchool(teacherRepository), teacherController.deleteTeacher);

// Students
router.post("/:schoolId/students", authMiddleware.auth([ROLE.ADMIN]), validateAddStudent, studentsController.addStudent);
router.get("/:schoolId/students", authMiddleware.auth([ROLE.ADMIN]), studentsController.listStudents);
router.get("/:schoolId/students/:id", authMiddleware.auth([ROLE.ADMIN]),ensureResourceBelongsToSchool(studentRepository), studentsController.getStudent);
router.put("/:schoolId/students/:id", authMiddleware.auth([ROLE.ADMIN]),  ensureResourceBelongsToSchool(studentRepository), studentsController.updateStudent);
router.delete("/:schoolId/students/:id", authMiddleware.auth([ROLE.ADMIN]),  ensureResourceBelongsToSchool(studentRepository), studentsController.deleteStudent);

// Parents
router.post("/:schoolId/parents", authMiddleware.auth([ROLE.ADMIN]), validateAddParent, parentsController.addParent);
router.get("/:schoolId/parents", authMiddleware.auth([ROLE.ADMIN]), parentsController.listParents);
router.get("/:schoolId/parents/:id", authMiddleware.auth([ROLE.ADMIN]),  ensureResourceBelongsToSchool(parentRepository), parentsController.getParent);
router.put("/:schoolId/parents/:id", authMiddleware.auth([ROLE.ADMIN]),  ensureResourceBelongsToSchool(parentRepository), parentsController.updateParent);
router.delete("/:schoolId/parents/:id", authMiddleware.auth([ROLE.ADMIN]),  ensureResourceBelongsToSchool(parentRepository), parentsController.deleteParent);
// Classes
router.post("/:schoolId/classes", authMiddleware.auth([ROLE.ADMIN]), validateCreateClass, classesController.createClass);
router.get("/:schoolId/classes", authMiddleware.auth([ROLE.ADMIN]), classesController.listClasses);
router.get("/:schoolId/classes/:id", authMiddleware.auth([ROLE.ADMIN]), classesController.getClass);
router.put("/:schoolId/classes/:id", authMiddleware.auth([ROLE.ADMIN]), classesController.updateClass);
router.delete("/:schoolId/classes/:id", authMiddleware.auth([ROLE.ADMIN]), classesController.deleteClass);

// Subjects
router.post("/:schoolId/subjects", authMiddleware.auth([ROLE.ADMIN]), validateAddSubject, subjectController.addSubject);
router.get("/:schoolId/subjects", authMiddleware.auth([ROLE.ADMIN]), subjectController.listSubjects);
router.get("/:schoolId/subjects/:id", authMiddleware.auth([ROLE.ADMIN]),  ensureResourceBelongsToSchool(subjectRepository), subjectController.getSubject);
router.get("/:schoolId/subjects/:classId", authMiddleware.auth([ROLE.ADMIN]), ensureResourceBelongsToSchool(subjectRepository), subjectController.getSubjectsByClass);
router.put("/:schoolId/subjects/:id", authMiddleware.auth([ROLE.ADMIN]),  ensureResourceBelongsToSchool(subjectRepository),  subjectController.updateSubject);
router.delete("/:schoolId/subjects/:id", authMiddleware.auth([ROLE.ADMIN]),  ensureResourceBelongsToSchool(subjectRepository), subjectController.deleteSubject);

// Sessions & Exams
router.post("/:schoolId/sessions", authMiddleware.auth([ROLE.ADMIN]), validateCreateSession, sessionsExamsController.createSession);
router.get("/:schoolId/sessions", authMiddleware.auth([ROLE.ADMIN]), sessionsExamsController.listSessions);
router.get("/:schoolId/sessions/:id", authMiddleware.auth([ROLE.ADMIN]), sessionsExamsController.getSession);
router.put("/:schoolId/sessions/:id", authMiddleware.auth([ROLE.ADMIN]),   sessionsExamsController.updateSession);
router.delete("/:schoolId/sessions/:id", authMiddleware.auth([ROLE.ADMIN]),   sessionsExamsController.deleteSession);

router.post("/:schoolId/exams", authMiddleware.auth([ROLE.ADMIN]), validateCreateExam, sessionsExamsController.createExam);
router.get("/:schoolId/exams", authMiddleware.auth([ROLE.ADMIN]), sessionsExamsController.listExams);
router.get("/:schoolId/exams/:id", authMiddleware.auth([ROLE.ADMIN]), sessionsExamsController.getExam);
router.put("/:schoolId/exams/:id", authMiddleware.auth([ROLE.ADMIN]), sessionsExamsController.updateExam);
router.delete("/:schoolId/exams/:id", authMiddleware.auth([ROLE.ADMIN]), sessionsExamsController.deleteExam);

// Attendance
router.post("/:schoolId/attendance", authMiddleware.auth([ROLE.ADMIN]), validateMarkAttendance, attendanceController.markAttendance);
router.get("/:schoolId/attendance", authMiddleware.auth([ROLE.ADMIN]), attendanceController.listAttendance);
router.get("/:schoolId/attendance/:id", authMiddleware.auth([ROLE.ADMIN]), attendanceController.getAttendance);

// Materials
router.post("/:schoolId/materials", authMiddleware.auth([ROLE.ADMIN]), validateAddMaterial, materialsController.addMaterial);
router.get("/:schoolId/materials", authMiddleware.auth([ROLE.ADMIN]), materialsController.listMaterials);
router.get("/:schoolId/materials/:id", authMiddleware.auth([ROLE.ADMIN]),  ensureResourceBelongsToSchool(materialRepository), materialsController.getMaterial);
router.put("/:schoolId/materials/:id", authMiddleware.auth([ROLE.ADMIN]),  ensureResourceBelongsToSchool(materialRepository), materialsController.updateMaterial);
router.delete("/:schoolId/materials/:id", authMiddleware.auth([ROLE.ADMIN]),  ensureResourceBelongsToSchool(materialRepository), materialsController.deleteMaterial);

// Scores
router.post("/:schoolId/scores", authMiddleware.auth([ROLE.ADMIN]), validateAddScore, scoresController.addScore);
router.get("/:schoolId/scores/student/:studentId", authMiddleware.auth([ROLE.ADMIN]), validateIdParam("studentId"), ensureResourceBelongsToSchool(studentRepository, "studentId"), scoresController.listScoresByStudent);
router.get("/:schoolId/scores/:id", authMiddleware.auth([ROLE.ADMIN]),  ensureResourceBelongsToSchool(scoreRepository), scoresController.getScore);
router.put("/:schoolId/scores/:id", authMiddleware.auth([ROLE.ADMIN]),  ensureResourceBelongsToSchool(scoreRepository), validateAddScore, scoresController.updateScore);
router.delete("/:schoolId/scores/:id", authMiddleware.auth([ROLE.ADMIN]),  ensureResourceBelongsToSchool(scoreRepository), scoresController.deleteScore);

// Grades
router.post("/:schoolId/grades", authMiddleware.auth([ROLE.ADMIN]), validateAddGrade, gradesController.addGrade);
router.get("/:schoolId/grades", authMiddleware.auth([ROLE.ADMIN]), gradesController.listGrades);
router.get("/:schoolId/grades/:id", authMiddleware.auth([ROLE.ADMIN]),  ensureResourceBelongsToSchool(gradeRepository), gradesController.getGrade);
router.put("/:schoolId/grades/:id", authMiddleware.auth([ROLE.ADMIN]),  ensureResourceBelongsToSchool(gradeRepository), validateAddGrade, gradesController.updateGrade);
router.delete("/:schoolId/grades/:id", authMiddleware.auth([ROLE.ADMIN]),  ensureResourceBelongsToSchool(gradeRepository), gradesController.deleteGrade);

// Settings
router.post("/:schoolId/settings", authMiddleware.auth([ROLE.ADMIN]), validateCreateSetting, settingsController.createSetting);
router.get("/:schoolId/settings", authMiddleware.auth([ROLE.ADMIN]), settingsController.listSettings);
router.get("/:schoolId/settings/:id", authMiddleware.auth([ROLE.ADMIN]),  ensureResourceBelongsToSchool(settingRepository), settingsController.getSetting);
router.put("/:schoolId/settings/:id", authMiddleware.auth([ROLE.ADMIN]),  ensureResourceBelongsToSchool(settingRepository), settingsController.updateSetting);
router.delete("/:schoolId/settings/:id", authMiddleware.auth([ROLE.ADMIN]),  ensureResourceBelongsToSchool(settingRepository), settingsController.deleteSetting);

// Alumni
router.post("/:schoolId/alumni", authMiddleware.auth([ROLE.ADMIN]), validateAddAlumni, alumniController.addAlumni);
router.get("/:schoolId/alumni", authMiddleware.auth([ROLE.ADMIN]), alumniController.listAlumni);
router.get("/:schoolId/alumni/:id", authMiddleware.auth([ROLE.ADMIN]),  ensureResourceBelongsToSchool(alumniRepository), alumniController.getAlumni);
router.put("/:schoolId/alumni/:id", authMiddleware.auth([ROLE.ADMIN]),  ensureResourceBelongsToSchool(alumniRepository), validateAddAlumni, alumniController.updateAlumni);
router.delete("/:schoolId/alumni/:id", authMiddleware.auth([ROLE.ADMIN]),  ensureResourceBelongsToSchool(alumniRepository), alumniController.deleteAlumni);

// Alumni
router.post("/:schoolId/alumni", authMiddleware.auth([ROLE.ADMIN]), validateAddAlumni, alumniController.addAlumni);
router.get("/:schoolId/alumni", authMiddleware.auth([ROLE.ADMIN]), alumniController.listAlumni);

// Dorms
router.post("/:schoolId/dorms", authMiddleware.auth([ROLE.ADMIN]), validateAddDorm, dormController.addDorm);

// Transport Routes
router.post("/:schoolId/transport-routes", authMiddleware.auth([ROLE.ADMIN]), validateAddTransportRoute, adminController.addTransportRoute);


export default router;
