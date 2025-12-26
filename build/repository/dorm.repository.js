"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dorm_entity_1 = require("../entities/dorm.entity");
const data_source_1 = require("../config/data-source");
const apiQuery_1 = __importDefault(require("../utils/apiQuery"));
class DormRepository {
    constructor() {
        this.dormRepository = data_source_1.AppDataSource.getRepository(dorm_entity_1.Dorm);
    }
    async create(data) {
        return await this.dormRepository.save({
            ...data,
            isActive: true,
            isDeleted: false,
        });
    }
    async findOne(query) {
        return await this.dormRepository.findOne({
            where: { ...query, isDeleted: false },
        });
    }
    async findAllBySchool(schoolId, queryString) {
        const query = this.dormRepository
            .createQueryBuilder("dorm")
            .where("dorm.schoolId = :schoolId", { schoolId })
            .andWhere("dorm.isDeleted = :isDeleted", { isDeleted: false });
        const apiQuery = new apiQuery_1.default(query, queryString, "dorm")
            .filter()
            .sort()
            .limitFields()
            .paginate();
        return await apiQuery.getQuery().getMany();
    }
    async countBySchool(schoolId) {
        return await this.dormRepository.count({
            where: { schoolId, isDeleted: false, isActive: true },
        });
    }
    async atomicUpdate(query, updateData) {
        await this.dormRepository.update(query, updateData);
        return this.findOne(query);
    }
    async deleteOne(query) {
        const result = await this.dormRepository.update(query, { isDeleted: true });
        return (result.affected ?? 0) > 0;
    }
}
exports.default = new DormRepository();
//# sourceMappingURL=dorm.repository.js.map