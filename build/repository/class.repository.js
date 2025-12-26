"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const class_entity_1 = require("../entities/class.entity");
const data_source_1 = require("../config/data-source");
const apiQuery_1 = __importDefault(require("../utils/apiQuery"));
class ClassRepository {
    constructor() {
        this.classRepository = data_source_1.AppDataSource.getRepository(class_entity_1.Class);
    }
    async create(data) {
        return await this.classRepository.save({
            ...data,
            isActive: true,
            isDeleted: false,
        });
    }
    async findOne(query) {
        return await this.classRepository.findOne({
            where: { ...query, isDeleted: false },
        });
    }
    async findAllBySchool(schoolId, queryString) {
        const query = this.classRepository
            .createQueryBuilder("class")
            .where("class.schoolId = :schoolId", { schoolId })
            .andWhere("class.isDeleted = :isDeleted", { isDeleted: false });
        const apiQuery = new apiQuery_1.default(query, queryString, "class")
            .filter()
            .sort()
            .limitFields()
            .paginate();
        return await apiQuery.getQuery().getMany();
    }
    async countBySchool(schoolId) {
        return await this.classRepository.count({
            where: { schoolId, isDeleted: false, isActive: true },
        });
    }
    async atomicUpdate(query, updateData) {
        await this.classRepository.update(query, updateData);
        return this.findOne(query);
    }
    async deleteOne(query) {
        const result = await this.classRepository.update(query, { isDeleted: true });
        return (result.affected ?? 0) > 0;
    }
}
exports.default = new ClassRepository();
//# sourceMappingURL=class.repository.js.map