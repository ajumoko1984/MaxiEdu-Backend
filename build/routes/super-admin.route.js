"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const school_controller_1 = __importDefault(require("../controllers/school.controller"));
const auth_middleware_1 = __importDefault(require("../middleware/auth.middleware"));
const school_schema_1 = require("../schema/school.schema");
const role_enum_1 = require("../enums/role.enum");
const router = express_1.default.Router();
router.get("/schools", auth_middleware_1.default.auth([role_enum_1.ROLE.SUPER_ADMIN]), school_controller_1.default.getAllSchools);
router.post("/schools", auth_middleware_1.default.auth([role_enum_1.ROLE.SUPER_ADMIN]), school_schema_1.validateCreateSchool, school_controller_1.default.createSchool);
router.get("/schools/:id", auth_middleware_1.default.auth([role_enum_1.ROLE.SUPER_ADMIN]), school_controller_1.default.getSchoolById);
router.put("/schools/:id", auth_middleware_1.default.auth([role_enum_1.ROLE.SUPER_ADMIN]), school_schema_1.validateUpdateSchool, school_controller_1.default.updateSchool);
router.delete("/schools/:id", auth_middleware_1.default.auth([role_enum_1.ROLE.SUPER_ADMIN]), school_controller_1.default.deleteSchool);
router.get("/overview", auth_middleware_1.default.auth([role_enum_1.ROLE.SUPER_ADMIN]), school_controller_1.default.getPlatformOverview);
exports.default = router;
//# sourceMappingURL=super-admin.route.js.map