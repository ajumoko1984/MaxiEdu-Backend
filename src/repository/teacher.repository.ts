import { Repository, FindOptionsWhere } from "typeorm";
import { Teacher } from "../entities/teacher.entity";
import { AppDataSource } from "../config/data-source";
import APIQuery from "../utils/apiQuery";

class TeacherRepository {
  private readonly teacherRepository: Repository<Teacher>;

  constructor() {
    this.teacherRepository = AppDataSource.getRepository(Teacher);
  }


  public async create(data: any): Promise<Teacher> {
  const { profileImage } = data;
  if (profileImage) {
    const imageBuffer = Buffer.from(profileImage.base64, "base64");
    data.profileImage = {
      buffer: imageBuffer,
      mimetype: profileImage.mimetype,
    };
  }
  return await this.teacherRepository.save(data);
}

  public async findOne(query: any): Promise<Teacher | null> {
    return await this.teacherRepository.findOne({
      where: { ...query, isDeleted: false },
    });
  }

  public async findAllBySchool(schoolId: string, queryString: any): Promise<Teacher[]> {
    const query = this.teacherRepository
      .createQueryBuilder("teacher")
      .where("teacher.schoolId = :schoolId", { schoolId })
      .andWhere("teacher.isDeleted = :isDeleted", { isDeleted: false });

    const apiQuery = new APIQuery(query, queryString, "teacher")
      .filter()
      .sort()
      .limitFields()
      .paginate();

    return await apiQuery.getQuery().getMany();
  }

public async findProfileImageById(id: string) {
  return await this.teacherRepository
    .createQueryBuilder("teacher")
    .select([
      "teacher.profileImageBase64",
      "teacher.profileImageMimeType",
      "teacher.passportBase64",
      "teacher.passportMimeType",
    ])
    .where("teacher.id = :id", { id })
    .andWhere("teacher.isDeleted = false")
    .getOne();
}



  public async countBySchool(schoolId: string): Promise<number> {
    return await this.teacherRepository.count({
      where: { schoolId, isDeleted: false, isActive: true },
    });
  }

  // Return all teacher ids for a school (non-paginated)
  public async findIdsBySchool(schoolId: string): Promise<string[]> {
    const rows = await this.teacherRepository
      .createQueryBuilder("teacher")
      .select(["teacher.id"])
      .where("teacher.schoolId = :schoolId", { schoolId })
      .andWhere("teacher.isDeleted = :isDeleted", { isDeleted: false })
      .getMany();
    return rows.map((r: any) => r.id);
  }

  public async atomicUpdate(query: Partial<Teacher>, updateData: Partial<Teacher>): Promise<Teacher | null> {
    await this.teacherRepository.update(query as any, updateData);
    return this.findOne(query);
  }

  public async deleteOne(query: Partial<Teacher>): Promise<boolean> {
    const result = await this.teacherRepository.update(query as any, { isDeleted: true });
    return (result.affected ?? 0) > 0;
  }
}

export default new TeacherRepository();
