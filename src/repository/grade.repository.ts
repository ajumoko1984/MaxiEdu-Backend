import { Repository } from "typeorm";
import { Grade } from "../entities/grade.entity";
import { AppDataSource } from "../config/data-source";

class GradeRepository {
  private readonly repo: Repository<Grade>;

  constructor() {
    this.repo = AppDataSource.getRepository(Grade);
  }

  public async create(data: any): Promise<Grade> {
    return await this.repo.save(data);
  }

  public async findOne(query: any): Promise<Grade | null> {
    return await this.repo.findOne({ where: query });
  }

  public async findAll(): Promise<Grade[]> {
    return await this.repo.find();
  }

  public async atomicUpdate(query: Partial<Grade>, updateData: Partial<Grade>): Promise<Grade | null> {
    await this.repo.update(query, updateData);
    return this.findOne(query);
  }

  public async deleteOne(query: Partial<Grade>): Promise<boolean> {
    const result = await this.repo.delete(query as any);
    return (result.affected ?? 0) > 0;
  }
}

export default new GradeRepository();