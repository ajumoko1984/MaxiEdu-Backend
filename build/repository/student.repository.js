"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const student_entity_1 = require("../entities/student.entity");
const data_source_1 = require("../config/data-source");
const apiQuery_1 = __importDefault(require("../utils/apiQuery"));
class StudentRepository {
    constructor() {
        this.studentRepository = data_source_1.AppDataSource.getRepository(student_entity_1.Student);
    }
    async create(data) {
        const { profileImage } = data;
        if (profileImage) {
            const imageBuffer = Buffer.from(profileImage.base64, "base64");
            data.profileImage = {
                buffer: imageBuffer,
                mimetype: profileImage.mimetype,
            };
        }
        return await this.studentRepository.save({
            ...data,
            isActive: true,
            isDisabled: false,
            isDeleted: false,
        });
    }
    async findOne(query) {
        return await this.studentRepository.findOne({
            where: { ...query, isDeleted: false },
        });
    }
    async findAllBySchool(schoolId, queryString) {
        const query = this.studentRepository
            .createQueryBuilder("student")
            .where("student.schoolId = :schoolId", { schoolId })
            .andWhere("student.isDeleted = :isDeleted", { isDeleted: false });
        const apiQuery = new apiQuery_1.default(query, queryString, "student")
            .filter()
            .sort()
            .limitFields()
            .paginate();
        return await apiQuery.getQuery().getMany();
    }
    async findProfileImageById(id) {
        return await this.studentRepository
            .createQueryBuilder("student")
            .select([
            "student.profileImageBase64",
            "student.profileImageMimeType",
            "student.passportBase64",
            "student.passportMimeType",
        ])
            .where("student.id = :id", { id })
            .andWhere("student.isDeleted = false")
            .getOne();
    }
    async countBySchool(schoolId) {
        return await this.studentRepository.count({
            where: { schoolId, isDeleted: false, isActive: true },
        });
    }
    async findIdsBySchool(schoolId) {
        const rows = await this.studentRepository
            .createQueryBuilder("student")
            .select(["student.id"])
            .where("student.schoolId = :schoolId", { schoolId })
            .andWhere("student.isDeleted = :isDeleted", { isDeleted: false })
            .getMany();
        return rows.map((r) => r.id);
    }
    async atomicUpdate(query, updateData) {
        await this.studentRepository.update(query, updateData);
        return this.findOne(query);
    }
    async deleteOne(query) {
        const result = await this.studentRepository.update(query, { isDeleted: true });
        return (result.affected ?? 0) > 0;
    }
}
exports.default = new StudentRepository();
//# sourceMappingURL=student.repository.js.map