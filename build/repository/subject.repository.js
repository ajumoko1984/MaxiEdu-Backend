"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const subject_entity_1 = require("../entities/subject.entity");
const data_source_1 = require("../config/data-source");
const apiQuery_1 = __importDefault(require("../utils/apiQuery"));
class SubjectRepository {
    constructor() {
        this.subjectRepository = data_source_1.AppDataSource.getRepository(subject_entity_1.Subject);
    }
    async create(data) {
        return await this.subjectRepository.save({
            ...data,
            isActive: true,
            isDeleted: false,
        });
    }
    async findOne(query) {
        return await this.subjectRepository.findOne({
            where: { ...query, isDeleted: false },
        });
    }
    async findAllBySchool(schoolId, queryString) {
        const query = this.subjectRepository
            .createQueryBuilder("subject")
            .where("subject.schoolId = :schoolId", { schoolId })
            .andWhere("subject.isDeleted = :isDeleted", { isDeleted: false });
        const apiQuery = new apiQuery_1.default(query, queryString, "subject")
            .filter()
            .sort()
            .limitFields()
            .paginate();
        return await apiQuery.getQuery().getMany();
    }
    async countBySchool(schoolId) {
        return await this.subjectRepository.count({
            where: { schoolId, isDeleted: false, isActive: true },
        });
    }
    async atomicUpdate(query, updateData) {
        await this.subjectRepository.update(query, updateData);
        return this.findOne(query);
    }
    async deleteOne(query) {
        const result = await this.subjectRepository.update(query, { isDeleted: true });
        return (result.affected ?? 0) > 0;
    }
}
exports.default = new SubjectRepository();
//# sourceMappingURL=subject.repository.js.map