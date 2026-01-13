import { Repository, In } from "typeorm";
import { Attendance } from "../entities/attendance.entity";
import { AppDataSource } from "../config/data-source";
import APIQuery from "../utils/apiQuery";

class AttendanceRepository {
  private readonly attendanceRepository: Repository<Attendance>;

  constructor() {
    this.attendanceRepository = AppDataSource.getRepository(Attendance);
  }

  public async create(data: any): Promise<Attendance> {
    return await this.attendanceRepository.save(data);
  }

  public async findOne(query: any): Promise<Attendance | null> {
    return await this.attendanceRepository.findOne({ where: query });
  }

    public async findAllBySchool(schoolId: string, queryString: any): Promise<Attendance[]> {
      const query = this.attendanceRepository
        .createQueryBuilder("attendance")

      const apiQuery = new APIQuery(query, queryString, "attendance")
        .filter()
        .sort()
        .limitFields()
        .paginate();
  
      return await apiQuery.getQuery().getMany();
    }
 
  public async atomicUpdate(query: Partial<Attendance>, updateData: Partial<Attendance>): Promise<Attendance | null> {
    await this.attendanceRepository.update(query as any, updateData);
    return this.findOne(query);
  }

  public async deleteOne(query: Partial<Attendance>): Promise<boolean> {
    const result = await this.attendanceRepository.delete(query as any);
    return (result.affected ?? 0) > 0;
  }
}

export default new AttendanceRepository();