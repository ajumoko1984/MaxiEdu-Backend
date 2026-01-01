import { Repository } from "typeorm";
import { School } from "../entities/school.entity";
import { AppDataSource } from "../config/data-source";
import APIQuery from "../utils/apiQuery";

class SchoolRepository {
  private readonly schoolRepository: Repository<School>;

  constructor() {
    this.schoolRepository = AppDataSource.getRepository(School);
  }

  // Create a new school
  public async create({
    name,
    address,
    phoneNumber,
    email,
    website,
    principalName,
    description,
    registrationNumber,
    state,
    city,
  }: {
    name: string;
    address?: string;
    phoneNumber?: string;
    email?: string;
    website?: string;
    principalName?: string;
    description?: string;
    registrationNumber?: string;
    state?: string;
    city?: string;
  }): Promise<School> {
    return await this.schoolRepository.save({
      name,
      address,
      phoneNumber,
      email,
      website,
      principalName,
      description,
      registrationNumber,
      state,
      city,
      isActive: true,
      isDisabled: false,
      isDeleted: false,
    });
  }

  // Find all schools with filtering, sorting, pagination
  public async findAll(queryString: any): Promise<School[]> {
    const query = this.schoolRepository
      .createQueryBuilder("school")
      .where("school.isDeleted = :isDeleted", { isDeleted: false });

    const apiQuery = new APIQuery(query, queryString, "school")
      .filter()
      .sort()
      .limitFields()
      .paginate();

    return await apiQuery.getQuery().getMany();
  }

  // Find a single school
  public async findOne(query: any): Promise<School | null> {
    return await this.schoolRepository.findOne({
      where: { ...query, isDeleted: false },
    });
  }

  // Update a school
  public async atomicUpdate(
    query: Partial<School>,
    updateData: Partial<School>
  ): Promise<School | null> {
    await this.schoolRepository.update(query as any, updateData);
    return this.findOne(query);
  }

  // Soft delete a school
  public async deleteOne(query: Partial<School>): Promise<boolean> {
    const result = await this.schoolRepository.update(query as any, {
      isDeleted: true,
    });
    return (result.affected ?? 0) > 0;
  }

  // Get count of all active schools (for analytics)
  public async getActiveSchoolsCount(): Promise<number> {
    return await this.schoolRepository.count({
      where: { isDeleted: false, isActive: true },
    });
  }

  // Get all schools with key stats (for overview)
  public async getSchoolsOverview(): Promise<{
    totalSchools: number;
    activeSchools: number;
    disabledSchools: number;
    totalStudents: number;
    totalTeachers: number;
    totalStaff: number;
  }> {
    const schools = await this.schoolRepository.find({
      where: { isDeleted: false },
    });

    const totalStudents = schools.reduce((sum, s) => sum + s.totalStudents, 0);
    const totalTeachers = schools.reduce((sum, s) => sum + s.totalTeachers, 0);
    const totalStaff = schools.reduce((sum, s) => sum + s.totalStaff, 0);

    return {
      totalSchools: schools.length,
      activeSchools: schools.filter((s) => s.isActive && !s.isDisabled).length,
      disabledSchools: schools.filter((s) => s.isDisabled).length,
      totalStudents,
      totalTeachers,
      totalStaff,
    };
  }
}

export default new SchoolRepository();
