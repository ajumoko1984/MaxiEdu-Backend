import { Repository } from "typeorm";
import { Transport } from "../entities/transport.entity";
import { AppDataSource } from "../config/data-source";
import APIQuery from "../utils/apiQuery";

class TransportRepository {
  private readonly transportRepository: Repository<Transport>;

  constructor() {
    this.transportRepository = AppDataSource.getRepository(Transport);
  }

  public async create(data: any): Promise<Transport> {
    return await this.transportRepository.save({
      ...data,
      isActive: true,
      isDeleted: false,
    });
  }

  public async findOne(query: any): Promise<Transport | null> {
    return await this.transportRepository.findOne({
      where: { ...query, isDeleted: false },
    });
  }

  public async findAllBySchool(schoolId: string, queryString: any): Promise<Transport[]> {
    const query = this.transportRepository
      .createQueryBuilder("transport")
      .where("transport.schoolId = :schoolId", { schoolId })
      .andWhere("transport.isDeleted = :isDeleted", { isDeleted: false });

    const apiQuery = new APIQuery(query, queryString, "transport")
      .filter()
      .sort()
      .limitFields()
      .paginate();

    return await apiQuery.getQuery().getMany();
  }

  public async countBySchool(schoolId: string): Promise<number> {
    return await this.transportRepository.count({
      where: { schoolId, isDeleted: false, isActive: true },
    });
  }

  public async atomicUpdate(query: Partial<Transport>, updateData: Partial<Transport>): Promise<Transport | null> {
    await this.transportRepository.update(query, updateData);
    return this.findOne(query);
  }

  public async deleteOne(query: Partial<Transport>): Promise<boolean> {
    const result = await this.transportRepository.update(query, { isDeleted: true });
    return (result.affected ?? 0) > 0;
  }
}

export default new TransportRepository();
