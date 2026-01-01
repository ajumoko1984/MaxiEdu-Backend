import { Repository } from "typeorm";
import { Exam } from "../entities/exam.entity";
import { AppDataSource } from "../config/data-source";

class ExamRepository {
  private readonly repo: Repository<Exam>;

  constructor() {
    this.repo = AppDataSource.getRepository(Exam);
  }

  public async create(data: any): Promise<Exam> {
    return await this.repo.save(data);
  }

  public async findOne(query: any): Promise<Exam | null> {
    return await this.repo.findOne({ where: query });
  }

  public async findAll(): Promise<Exam[]> {
    return await this.repo.find();
  }

  public async atomicUpdate(query: Partial<Exam>, updateData: Partial<Exam>): Promise<Exam | null> {
    await this.repo.update(query, updateData);
    return this.findOne(query);
  }

  public async deleteOne(query: Partial<Exam>): Promise<boolean> {
    const result = await this.repo.delete(query as any);
    return (result.affected ?? 0) > 0;
  }
}

export default new ExamRepository();