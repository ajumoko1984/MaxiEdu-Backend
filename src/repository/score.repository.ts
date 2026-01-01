import { Repository } from "typeorm";
import { Score } from "../entities/score.entity";
import { AppDataSource } from "../config/data-source";

class ScoreRepository {
  private readonly repo: Repository<Score>;

  constructor() {
    this.repo = AppDataSource.getRepository(Score);
  }

  public async create(data: any): Promise<Score> {
    return await this.repo.save(data);
  }

  public async findOne(query: any): Promise<Score | null> {
    return await this.repo.findOne({ where: query });
  }

  public async findByStudent(studentId: string): Promise<Score[]> {
    return await this.repo.find({ where: { studentId } });
  }

  public async atomicUpdate(query: Partial<Score>, updateData: Partial<Score>): Promise<Score | null> {
    await this.repo.update(query, updateData);
    return this.findOne(query);
  }

  public async deleteOne(query: Partial<Score>): Promise<boolean> {
    const result = await this.repo.delete(query as any);
    return (result.affected ?? 0) > 0;
  }
}

export default new ScoreRepository();