"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const teacher_entity_1 = require("../entities/teacher.entity");
const data_source_1 = require("../config/data-source");
const apiQuery_1 = __importDefault(require("../utils/apiQuery"));
class TeacherRepository {
    constructor() {
        this.teacherRepository = data_source_1.AppDataSource.getRepository(teacher_entity_1.Teacher);
    }
    async create(data) {
        return await this.teacherRepository.save({
            ...data,
            isActive: true,
            isDisabled: false,
            isDeleted: false,
        });
    }
    async findOne(query) {
        return await this.teacherRepository.findOne({
            where: { ...query, isDeleted: false },
        });
    }
    async findAllBySchool(schoolId, queryString) {
        const query = this.teacherRepository
            .createQueryBuilder("teacher")
            .where("teacher.schoolId = :schoolId", { schoolId })
            .andWhere("teacher.isDeleted = :isDeleted", { isDeleted: false });
        const apiQuery = new apiQuery_1.default(query, queryString, "teacher")
            .filter()
            .sort()
            .limitFields()
            .paginate();
        return await apiQuery.getQuery().getMany();
    }
    async countBySchool(schoolId) {
        return await this.teacherRepository.count({
            where: { schoolId, isDeleted: false, isActive: true },
        });
    }
    async atomicUpdate(query, updateData) {
        await this.teacherRepository.update(query, updateData);
        return this.findOne(query);
    }
    async deleteOne(query) {
        const result = await this.teacherRepository.update(query, { isDeleted: true });
        return (result.affected ?? 0) > 0;
    }
}
exports.default = new TeacherRepository();
//# sourceMappingURL=teacher.repository.js.map