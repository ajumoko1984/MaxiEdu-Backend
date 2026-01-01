import { Repository } from "typeorm";
import { Session } from "../entities/session.entity";
import { AppDataSource } from "../config/data-source";

class SessionRepository {
  private readonly repo: Repository<Session>;

  constructor() {
    this.repo = AppDataSource.getRepository(Session);
  }

  public async create(data: any): Promise<Session> {
    return await this.repo.save(data);
  }

  public async findOne(query: any): Promise<Session | null> {
    return await this.repo.findOne({ where: query });
  }

  public async findAll(): Promise<Session[]> {
    return await this.repo.find();
  }

  public async atomicUpdate(query: Partial<Session>, updateData: Partial<Session>): Promise<Session | null> {
    await this.repo.update(query, updateData);
    return this.findOne(query);
  }

  public async deleteOne(query: Partial<Session>): Promise<boolean> {
    const result = await this.repo.delete(query as any);
    return (result.affected ?? 0) > 0;
  }
}

export default new SessionRepository();