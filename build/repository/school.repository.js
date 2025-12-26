"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const school_entity_1 = require("../entities/school.entity");
const data_source_1 = require("../config/data-source");
const apiQuery_1 = __importDefault(require("../utils/apiQuery"));
class SchoolRepository {
    constructor() {
        this.schoolRepository = data_source_1.AppDataSource.getRepository(school_entity_1.School);
    }
    async create({ name, address, phoneNumber, email, website, principalName, description, registrationNumber, state, city, }) {
        return await this.schoolRepository.save({
            name,
            address,
            phoneNumber,
            email,
            website,
            principalName,
            description,
            registrationNumber,
            state,
            city,
            isActive: true,
            isDisabled: false,
            isDeleted: false,
        });
    }
    async findAll(queryString) {
        const query = this.schoolRepository
            .createQueryBuilder("school")
            .where("school.isDeleted = :isDeleted", { isDeleted: false });
        const apiQuery = new apiQuery_1.default(query, queryString, "school")
            .filter()
            .sort()
            .limitFields()
            .paginate();
        return await apiQuery.getQuery().getMany();
    }
    async findOne(query) {
        return await this.schoolRepository.findOne({
            where: { ...query, isDeleted: false },
        });
    }
    async atomicUpdate(query, updateData) {
        await this.schoolRepository.update(query, updateData);
        return this.findOne(query);
    }
    async deleteOne(query) {
        const result = await this.schoolRepository.update(query, {
            isDeleted: true,
        });
        return (result.affected ?? 0) > 0;
    }
    async getActiveSchoolsCount() {
        return await this.schoolRepository.count({
            where: { isDeleted: false, isActive: true },
        });
    }
    async getSchoolsOverview() {
        const schools = await this.schoolRepository.find({
            where: { isDeleted: false },
        });
        const totalStudents = schools.reduce((sum, s) => sum + s.totalStudents, 0);
        const totalTeachers = schools.reduce((sum, s) => sum + s.totalTeachers, 0);
        const totalStaff = schools.reduce((sum, s) => sum + s.totalStaff, 0);
        return {
            totalSchools: schools.length,
            activeSchools: schools.filter((s) => s.isActive && !s.isDisabled).length,
            disabledSchools: schools.filter((s) => s.isDisabled).length,
            totalStudents,
            totalTeachers,
            totalStaff,
        };
    }
}
exports.default = new SchoolRepository();
//# sourceMappingURL=school.repository.js.map