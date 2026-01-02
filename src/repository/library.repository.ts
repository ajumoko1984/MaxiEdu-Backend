import { Repository, In } from "typeorm";
import { Library } from "../entities/library.entity";
import { AppDataSource } from "../config/data-source";

class LibraryRepository {
  private readonly repo: Repository<Library>;

  constructor() {
    this.repo = AppDataSource.getRepository(Library);
  }

  public async create(data: any): Promise<Library> {
    return await this.repo.save(data);
  }

    public async findAll(): Promise<Library[]> {
    return await this.repo.find();
  }

  public async findOne(query: any): Promise<Library | null> {
    return await this.repo.findOne({ where: query });
  }


  public async atomicUpdate(query: Partial<Library>, updateData: Partial<Library>): Promise<Library | null> {
    await this.repo.update(query, updateData);
    return this.findOne(query);
  }

  public async deleteOne(query: Partial<Library>): Promise<boolean> {
    const result = await this.repo.delete(query as any);
    return (result.affected ?? 0) > 0;
  }
}

export default new LibraryRepository();