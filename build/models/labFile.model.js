"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const LabFileModel = {
    async create(payload) {
        return { _id: String(Date.now()), name: payload.name, mimetype: payload.mimetype };
    },
};
exports.default = LabFileModel;
//# sourceMappingURL=labFile.model.js.map