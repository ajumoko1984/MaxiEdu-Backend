import { Repository } from "typeorm";
import { Student } from "../entities/student.entity";
import { AppDataSource } from "../config/data-source";
import APIQuery from "../utils/apiQuery";

class StudentRepository {
  private readonly studentRepository: Repository<Student>;

  constructor() {
    this.studentRepository = AppDataSource.getRepository(Student);
  }

  public async create(data: any): Promise<Student> {
    return await this.studentRepository.save({
      ...data,
      isActive: true,
      isDisabled: false,
      isDeleted: false,
    });
  }

  public async findOne(query: any): Promise<Student | null> {
    return await this.studentRepository.findOne({
      where: { ...query, isDeleted: false },
    });
  }

  public async findAllBySchool(schoolId: string, queryString: any): Promise<Student[]> {
    const query = this.studentRepository
      .createQueryBuilder("student")
      .where("student.schoolId = :schoolId", { schoolId })
      .andWhere("student.isDeleted = :isDeleted", { isDeleted: false });

    const apiQuery = new APIQuery(query, queryString, "student")
      .filter()
      .sort()
      .limitFields()
      .paginate();

    return await apiQuery.getQuery().getMany();
  }

  public async countBySchool(schoolId: string): Promise<number> {
    return await this.studentRepository.count({
      where: { schoolId, isDeleted: false, isActive: true },
    });
  }

  public async atomicUpdate(query: Partial<Student>, updateData: Partial<Student>): Promise<Student | null> {
    await this.studentRepository.update(query, updateData);
    return this.findOne(query);
  }

  public async deleteOne(query: Partial<Student>): Promise<boolean> {
    const result = await this.studentRepository.update(query, { isDeleted: true });
    return (result.affected ?? 0) > 0;
  }
}

export default new StudentRepository();
