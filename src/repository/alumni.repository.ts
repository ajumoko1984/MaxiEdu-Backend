import { Repository } from "typeorm";
import { Alumni } from "../entities/alumni.entity";
import { AppDataSource } from "../config/data-source";

class AlumniRepository {
  private readonly repo: Repository<Alumni>;

  constructor() {
    this.repo = AppDataSource.getRepository(Alumni);
  }

  public async create(data: any): Promise<Alumni> {
    return await this.repo.save(data);
  }

  public async findOne(query: any): Promise<Alumni | null> {
    return await this.repo.findOne({ where: query });
  }

  public async findAll(): Promise<Alumni[]> {
    return await this.repo.find();
  }

  public async atomicUpdate(query: Partial<Alumni>, updateData: Partial<Alumni>): Promise<Alumni | null> {
    await this.repo.update(query, updateData);
    return this.findOne(query);
  }

  public async deleteOne(query: Partial<Alumni>): Promise<boolean> {
    const result = await this.repo.delete(query as any);
    return (result.affected ?? 0) > 0;
  }
}

export default new AlumniRepository();