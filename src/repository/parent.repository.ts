import { Repository } from "typeorm";
import { Parent } from "../entities/parent.entity";
import { AppDataSource } from "../config/data-source";
import APIQuery from "../utils/apiQuery";

class ParentRepository {
  private readonly parentRepository: Repository<Parent>;

  constructor() {
    this.parentRepository = AppDataSource.getRepository(Parent);
  }

  public async create(data: any): Promise<Parent> {
    return await this.parentRepository.save({
      ...data,
      isActive: true,
      isDeleted: false,
    });
  }

  public async findOne(query: any): Promise<Parent | null> {
    return await this.parentRepository.findOne({ where: { ...query, isDeleted: false } });
  }

  public async findAllBySchool(schoolId: string, queryString: any): Promise<Parent[]> {
    const query = this.parentRepository
      .createQueryBuilder("parent")
      .where("parent.schoolId = :schoolId", { schoolId })
      .andWhere("parent.isDeleted = :isDeleted", { isDeleted: false });

    const apiQuery = new APIQuery(query, queryString, "parent").filter().sort().limitFields().paginate();

    return await apiQuery.getQuery().getMany();
  }

  public async countBySchool(schoolId: string): Promise<number> {
    return await this.parentRepository.count({ where: { schoolId, isDeleted: false, isActive: true } });
  }

  public async atomicUpdate(query: Partial<Parent>, updateData: Partial<Parent>): Promise<Parent | null> {
    await this.parentRepository.update(query, updateData);
    return this.findOne(query);
  }

  public async deleteOne(query: Partial<Parent>): Promise<boolean> {
    const result = await this.parentRepository.update(query, { isDeleted: true });
    return (result.affected ?? 0) > 0;
  }
}

export default new ParentRepository();