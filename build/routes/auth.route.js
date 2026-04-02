"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_controller_1 = __importDefault(require("../controllers/auth.controller"));
const auth_middleware_1 = __importDefault(require("../middleware/auth.middleware"));
const auth_schema_1 = require("../schema/auth.schema");
const role_enum_1 = require("../enums/role.enum");
const schoolAuth_controller_1 = __importDefault(require("../controllers/schoolAuth.controller"));
const router = express_1.default.Router();
router.post("/register-super-admin", auth_schema_1.validateUserSignup, auth_controller_1.default.registerSuperAdmin);
router.post("/login", auth_schema_1.validateUserLogin, auth_controller_1.default.login);
router.post("/logout", auth_middleware_1.default.auth(), auth_controller_1.default.logout);
router.post("/forgot-password", auth_schema_1.validateForgotPassword, auth_controller_1.default.forgotPassword);
router.post("/reset-password", auth_schema_1.validateResetPasswordToken, auth_controller_1.default.resetPassword);
router.get("/profile", auth_middleware_1.default.auth(), auth_controller_1.default.getProfile);
router.put("/profile", auth_middleware_1.default.auth(), auth_schema_1.validateProfileUpdate, auth_controller_1.default.updateProfile);
router.post("/registerSchoolAdmin", auth_schema_1.validateSchoolAdminSignup, schoolAuth_controller_1.default.registerSchoolAdmin);
router.put("/admin/approve", auth_middleware_1.default.auth([role_enum_1.ROLE.SUPER_ADMIN]), schoolAuth_controller_1.default.approveSchoolAdmin);
router.post("/loginSchoolAdmin", auth_schema_1.validateSchoolAdminLogin, schoolAuth_controller_1.default.loginSchoolAdmin);
router.put("/admins/:id/deactivate", auth_middleware_1.default.auth([role_enum_1.ROLE.SUPER_ADMIN]), schoolAuth_controller_1.default.deactivateSchoolAdmin);
exports.default = router;
//# sourceMappingURL=auth.route.js.map