"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_controller_1 = __importDefault(require("../controllers/user.controller"));
const auth_middleware_1 = __importDefault(require("../middleware/auth.middleware"));
const user_schema_1 = require("../schema/user.schema");
const role_enum_1 = require("../enums/role.enum");
const router = express_1.default.Router();
router.post("/defaultAdmin", user_schema_1.validateUserSignup, user_controller_1.default.default);
router.post("/createAdmin", auth_middleware_1.default.auth([role_enum_1.ROLE.SUPER_ADMIN]), user_schema_1.validateUserSignup, user_controller_1.default.admin);
router.post("/createStaff", auth_middleware_1.default.auth([role_enum_1.ROLE.SUPER_ADMIN, role_enum_1.ROLE.ADMIN, role_enum_1.ROLE.HR]), user_schema_1.validateUserSignup, user_controller_1.default.staff);
router.post("/login", user_schema_1.validateUserLogin, user_controller_1.default.login);
router.patch("/changePassword/:userId", user_schema_1.validateUserChangePassword, user_controller_1.default.changeDefaultPassword);
router.patch("/accountDisabled/:id", auth_middleware_1.default.auth([role_enum_1.ROLE.SUPER_ADMIN, role_enum_1.ROLE.ADMIN, role_enum_1.ROLE.HR]), user_controller_1.default.accountDisabled);
router.get("/", auth_middleware_1.default.auth([role_enum_1.ROLE.SUPER_ADMIN, role_enum_1.ROLE.ADMIN, role_enum_1.ROLE.HR]), user_controller_1.default.getAllUsers);
router.get("/:id", auth_middleware_1.default.auth(), user_controller_1.default.getUser);
router.patch("/accountDeleted/:id", auth_middleware_1.default.auth([role_enum_1.ROLE.SUPER_ADMIN, role_enum_1.ROLE.ADMIN, role_enum_1.ROLE.HR]), user_controller_1.default.deleteUser);
router.patch("/resetPassword", auth_middleware_1.default.auth([role_enum_1.ROLE.SUPER_ADMIN, role_enum_1.ROLE.ADMIN, role_enum_1.ROLE.HR]), user_schema_1.validateResetPassword, user_controller_1.default.resetPassword);
router.post("/logout", auth_middleware_1.default.auth(), user_controller_1.default.logout);
exports.default = router;
//# sourceMappingURL=user.route.js.map