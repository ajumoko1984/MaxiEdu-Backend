import { Repository } from "typeorm";
import { Subject } from "../entities/subject.entity";
import { AppDataSource } from "../config/data-source";
import APIQuery from "../utils/apiQuery";

class SubjectRepository {
  private readonly subjectRepository: Repository<Subject>;

  constructor() {
    this.subjectRepository = AppDataSource.getRepository(Subject);
  }

  public async create(data: any): Promise<Subject> {
    return await this.subjectRepository.save({
      ...data,
      isActive: true,
      isDeleted: false,
    });
  }

  public async findOne(query: any): Promise<Subject | null> {
    return await this.subjectRepository.findOne({
      where: { ...query, isDeleted: false },
    });
  }

  public async findAllBySchool(schoolId: string, queryString: any): Promise<Subject[]> {
    const query = this.subjectRepository
      .createQueryBuilder("subject")
      .where("subject.schoolId = :schoolId", { schoolId })
      .andWhere("subject.isDeleted = :isDeleted", { isDeleted: false });

    const apiQuery = new APIQuery(query, queryString, "subject")
      .filter()
      .sort()
      .limitFields()
      .paginate();

    return await apiQuery.getQuery().getMany();
  }

  public async countBySchool(schoolId: string): Promise<number> {
    return await this.subjectRepository.count({
      where: { schoolId, isDeleted: false, isActive: true },
    });
  }

  public async atomicUpdate(query: Partial<Subject>, updateData: Partial<Subject>): Promise<Subject | null> {
    await this.subjectRepository.update(query, updateData);
    return this.findOne(query);
  }

  public async deleteOne(query: Partial<Subject>): Promise<boolean> {
    const result = await this.subjectRepository.update(query, { isDeleted: true });
    return (result.affected ?? 0) > 0;
  }
}

export default new SubjectRepository();
