import { Repository } from "typeorm";
import { Dorm } from "../entities/dorm.entity";
import { AppDataSource } from "../config/data-source";
import APIQuery from "../utils/apiQuery";

class DormRepository {
  private readonly dormRepository: Repository<Dorm>;

  constructor() {
    this.dormRepository = AppDataSource.getRepository(Dorm);
  }

  public async create(data: any): Promise<Dorm> {
    return await this.dormRepository.save({
      ...data,
      isActive: true,
      isDeleted: false,
    });
  }

  public async findOne(query: any): Promise<Dorm | null> {
    return await this.dormRepository.findOne({
      where: { ...query, isDeleted: false },
    });
  }

  public async findAllBySchool(schoolId: string, queryString: any): Promise<Dorm[]> {
    const query = this.dormRepository
      .createQueryBuilder("dorm")
      .where("dorm.schoolId = :schoolId", { schoolId })
      .andWhere("dorm.isDeleted = :isDeleted", { isDeleted: false });

    const apiQuery = new APIQuery(query, queryString, "dorm")
      .filter()
      .sort()
      .limitFields()
      .paginate();

    return await apiQuery.getQuery().getMany();
  }

  public async countBySchool(schoolId: string): Promise<number> {
    return await this.dormRepository.count({
      where: { schoolId, isDeleted: false, isActive: true },
    });
  }

  public async atomicUpdate(query: Partial<Dorm>, updateData: Partial<Dorm>): Promise<Dorm | null> {
    await this.dormRepository.update(query, updateData);
    return this.findOne(query);
  }

  public async deleteOne(query: Partial<Dorm>): Promise<boolean> {
    const result = await this.dormRepository.update(query, { isDeleted: true });
    return (result.affected ?? 0) > 0;
  }
}

export default new DormRepository();
