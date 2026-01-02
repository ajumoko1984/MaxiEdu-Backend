import { Repository } from "typeorm";
import { Timetable } from "../entities/timetable.entity";
import { AppDataSource } from "../config/data-source";

class TimetableRepository {
  private readonly repo: Repository<Timetable>;

  constructor() {
    this.repo = AppDataSource.getRepository(Timetable);
  }

  public async create(data: any): Promise<Timetable> {
    return await this.repo.save(data);
  }

  public async findAll(): Promise<Timetable[]> {
    return await this.repo.find();
  }

  public async findOne(query: any): Promise<Timetable | null> {
    return await this.repo.findOne({ where: query });
  }

  public async atomicUpdate(query: Partial<Timetable>, updateData: Partial<Timetable>): Promise<Timetable | null> {
    await this.repo.update(query, updateData);
    return this.findOne(query);
  }

  public async deleteOne(query: Partial<Timetable>): Promise<boolean> {
    const result = await this.repo.delete(query as any);
    return (result.affected ?? 0) > 0;
  }
}

export default new TimetableRepository();