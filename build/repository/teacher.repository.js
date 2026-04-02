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
        const { profileImage } = data;
        if (profileImage) {
            const imageBuffer = Buffer.from(profileImage.base64, "base64");
            data.profileImage = {
                buffer: imageBuffer,
                mimetype: profileImage.mimetype,
            };
        }
        return await this.teacherRepository.save(data);
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
    async findProfileImageById(id) {
        return await this.teacherRepository
            .createQueryBuilder("teacher")
            .select([
            "teacher.profileImageBase64",
            "teacher.profileImageMimeType",
            "teacher.passportBase64",
            "teacher.passportMimeType",
        ])
            .where("teacher.id = :id", { id })
            .andWhere("teacher.isDeleted = false")
            .getOne();
    }
    async countBySchool(schoolId) {
        return await this.teacherRepository.count({
            where: { schoolId, isDeleted: false, isActive: true },
        });
    }
    async findIdsBySchool(schoolId) {
        const rows = await this.teacherRepository
            .createQueryBuilder("teacher")
            .select(["teacher.id"])
            .where("teacher.schoolId = :schoolId", { schoolId })
            .andWhere("teacher.isDeleted = :isDeleted", { isDeleted: false })
            .getMany();
        return rows.map((r) => r.id);
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