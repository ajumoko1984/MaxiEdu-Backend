"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const transport_entity_1 = require("../entities/transport.entity");
const data_source_1 = require("../config/data-source");
const apiQuery_1 = __importDefault(require("../utils/apiQuery"));
class TransportRepository {
    constructor() {
        this.transportRepository = data_source_1.AppDataSource.getRepository(transport_entity_1.Transport);
    }
    async create(data) {
        return await this.transportRepository.save({
            ...data,
            isActive: true,
            isDeleted: false,
        });
    }
    async findOne(query) {
        return await this.transportRepository.findOne({
            where: { ...query, isDeleted: false },
        });
    }
    async findAllBySchool(schoolId, queryString) {
        const query = this.transportRepository
            .createQueryBuilder("transport")
            .where("transport.schoolId = :schoolId", { schoolId })
            .andWhere("transport.isDeleted = :isDeleted", { isDeleted: false });
        const apiQuery = new apiQuery_1.default(query, queryString, "transport")
            .filter()
            .sort()
            .limitFields()
            .paginate();
        return await apiQuery.getQuery().getMany();
    }
    async countBySchool(schoolId) {
        return await this.transportRepository.count({
            where: { schoolId, isDeleted: false, isActive: true },
        });
    }
    async atomicUpdate(query, updateData) {
        await this.transportRepository.update(query, updateData);
        return this.findOne(query);
    }
    async deleteOne(query) {
        const result = await this.transportRepository.update(query, { isDeleted: true });
        return (result.affected ?? 0) > 0;
    }
}
exports.default = new TransportRepository();
//# sourceMappingURL=transport.repository.js.map