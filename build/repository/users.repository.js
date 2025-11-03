"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_entity_1 = require("../entities/user.entity");
const data_source_1 = require("../config/data-source");
const role_enum_1 = require("../enums/role.enum");
const apiQuery_1 = __importDefault(require("../utils/apiQuery"));
class UsersRepository {
    constructor() {
        this.userRepository = data_source_1.AppDataSource.getRepository(user_entity_1.User);
    }
    async create({ firstName, lastName, email, password, accountType, isDefaultPassword, isActive, }) {
        return await this.userRepository.save({
            firstName,
            lastName,
            email,
            password,
            accountType,
            isDefaultPassword,
            isActive,
        });
    }
    async findAll(queryString) {
        const query = this.userRepository
            .createQueryBuilder("user")
            .where("user.isDeleted = :isDeleted", { isDeleted: false })
            .andWhere("user.accountType != :role", { role: role_enum_1.ROLE.SUPER_ADMIN });
        const apiQuery = new apiQuery_1.default(query, queryString, "user")
            .filter()
            .sort()
            .limitFields()
            .paginate();
        return await apiQuery.getQuery().getMany();
    }
    async findOne(query) {
        return await this.userRepository.findOne({ where: query });
    }
    async atomicUpdate(query, updateData) {
        await this.userRepository.update(query, updateData);
        return this.findOne(query);
    }
    async deleteOne(query) {
        const result = await this.userRepository.delete(query);
        return (result.affected ?? 0) > 0;
    }
}
exports.default = new UsersRepository();
//# sourceMappingURL=users.repository.js.map