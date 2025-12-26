import { Repository } from "typeorm";
import { Class } from "../entities/class.entity";
import { AppDataSource } from "../config/data-source";
import APIQuery from "../utils/apiQuery";

class ClassRepository {
  private readonly classRepository: Repository<Class>;

  constructor() {
    this.classRepository = AppDataSource.getRepository(Class);
  }

  public async create(data: any): Promise<Class> {
    return await this.classRepository.save({
      ...data,
      isActive: true,
      isDeleted: false,
    });
  }

  public async findOne(query: any): Promise<Class | null> {
    return await this.classRepository.findOne({
      where: { ...query, isDeleted: false },
    });
  }

  public async findAllBySchool(schoolId: string, queryString: any): Promise<Class[]> {
    const query = this.classRepository
      .createQueryBuilder("class")
      .where("class.schoolId = :schoolId", { schoolId })
      .andWhere("class.isDeleted = :isDeleted", { isDeleted: false });

    const apiQuery = new APIQuery(query, queryString, "class")
      .filter()
      .sort()
      .limitFields()
      .paginate();

    return await apiQuery.getQuery().getMany();
  }

  public async countBySchool(schoolId: string): Promise<number> {
    return await this.classRepository.count({
      where: { schoolId, isDeleted: false, isActive: true },
    });
  }

  public async atomicUpdate(query: Partial<Class>, updateData: Partial<Class>): Promise<Class | null> {
    await this.classRepository.update(query, updateData);
    return this.findOne(query);
  }

  public async deleteOne(query: Partial<Class>): Promise<boolean> {
    const result = await this.classRepository.update(query, { isDeleted: true });
    return (result.affected ?? 0) > 0;
  }
}

export default new ClassRepository();
