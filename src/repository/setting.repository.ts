import { Repository } from "typeorm";
import { Setting } from "../entities/setting.entity";
import { AppDataSource } from "../config/data-source";

class SettingRepository {
  private readonly repo: Repository<Setting>;

  constructor() {
    this.repo = AppDataSource.getRepository(Setting);
  }

  public async create(data: any): Promise<Setting> {
    return await this.repo.save(data);
  }

  public async findOne(query: any): Promise<Setting | null> {
    return await this.repo.findOne({ where: query });
  }

  public async findAll(): Promise<Setting[]> {
    return await this.repo.find();
  }

  public async atomicUpdate(query: Partial<Setting>, updateData: Partial<Setting>): Promise<Setting | null> {
    await this.repo.update(query, updateData);
    return this.findOne(query);
  }

  public async deleteOne(query: Partial<Setting>): Promise<boolean> {
    const result = await this.repo.delete(query as any);
    return (result.affected ?? 0) > 0;
  }
}

export default new SettingRepository();