"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAuth = getAuth;
const users_repository_1 = __importDefault(require("../repository/users.repository"));
const utils_1 = require("../utils");
async function getAuth(req, res) {
    const user = (0, utils_1.throwIfUndefined)(req.user, "req.user");
    const getUser = await users_repository_1.default.findOne({
        id: user.id,
    });
    if (!getUser) {
        return {
            error: "User not found",
        };
    }
    return getUser;
}
//# sourceMappingURL=auth.helper.js.map