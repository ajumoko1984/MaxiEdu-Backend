"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const admin_controller_1 = __importDefault(require("../controllers/admin.controller"));
const auth_middleware_1 = __importDefault(require("../middleware/auth.middleware"));
const role_enum_1 = require("../enums/role.enum");
const admin_schema_1 = require("../schema/admin.schema");
const router = (0, express_1.Router)();
router.get("/dashboard/:schoolId", auth_middleware_1.default.auth([role_enum_1.ROLE.ADMIN]), admin_controller_1.default.getDashboard);
router.post("/teachers/:schoolId", auth_middleware_1.default.auth([role_enum_1.ROLE.ADMIN]), admin_schema_1.validateAddTeacher, admin_controller_1.default.addTeacher);
router.get("/teachers/:schoolId", auth_middleware_1.default.auth([role_enum_1.ROLE.ADMIN]), admin_controller_1.default.listTeachers);
router.post("/students/:schoolId", auth_middleware_1.default.auth([role_enum_1.ROLE.ADMIN]), admin_schema_1.validateAddStudent, admin_controller_1.default.addStudent);
router.get("/students/:schoolId", auth_middleware_1.default.auth([role_enum_1.ROLE.ADMIN]), admin_controller_1.default.listStudents);
router.post("/classes/:schoolId", auth_middleware_1.default.auth([role_enum_1.ROLE.ADMIN]), admin_schema_1.validateCreateClass, admin_controller_1.default.createClass);
router.post("/subjects/:schoolId", auth_middleware_1.default.auth([role_enum_1.ROLE.ADMIN]), admin_schema_1.validateAddSubject, admin_controller_1.default.addSubject);
router.post("/dorms/:schoolId", auth_middleware_1.default.auth([role_enum_1.ROLE.ADMIN]), admin_schema_1.validateAddDorm, admin_controller_1.default.addDorm);
router.post("/transport-routes/:schoolId", auth_middleware_1.default.auth([role_enum_1.ROLE.ADMIN]), admin_schema_1.validateAddTransportRoute, admin_controller_1.default.addTransportRoute);
exports.default = router;
//# sourceMappingURL=admin.route.js.map