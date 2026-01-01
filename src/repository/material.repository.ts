import { Repository } from "typeorm";
import { Material } from "../entities/material.entity";
import { AppDataSource } from "../config/data-source";

class MaterialRepository {
  private readonly repo: Repository<Material>;

  constructor() {
    this.repo = AppDataSource.getRepository(Material);
  }

  public async create(data: any): Promise<Material> {
    return await this.repo.save(data);
  }

  public async findOne(query: any): Promise<Material | null> {
    return await this.repo.findOne({ where: query });
  }

  public async findAllBySchool(schoolId: string): Promise<Material[]> {
    return await this.repo.find({ where: { schoolId } });
  }

  public async atomicUpdate(query: Partial<Material>, updateData: Partial<Material>): Promise<Material | null> {
    await this.repo.update(query, updateData);
    return this.findOne(query);
  }

  public async deleteOne(query: Partial<Material>): Promise<boolean> {
    const result = await this.repo.delete(query as any);
    return (result.affected ?? 0) > 0;
  }
}

export default new MaterialRepository();