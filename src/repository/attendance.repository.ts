import { Repository, In } from "typeorm";
import { Attendance } from "../entities/attendance.entity";
import { AppDataSource } from "../config/data-source";

class AttendanceRepository {
  private readonly repo: Repository<Attendance>;

  constructor() {
    this.repo = AppDataSource.getRepository(Attendance);
  }

  public async create(data: any): Promise<Attendance> {
    return await this.repo.save(data);
  }

  public async findOne(query: any): Promise<Attendance | null> {
    return await this.repo.findOne({ where: query });
  }

  public async findByUser(userId: string): Promise<Attendance[]> {
    return await this.repo.find({ where: { userId } });
  }

  public async findAllByUserType(userType: string): Promise<Attendance[]> {
    return await this.repo.find({ where: { userType } });
  }

  public async findAllByDate(date: Date | string): Promise<Attendance[]> {
    const dateStr = date instanceof Date ? date.toISOString().split("T")[0] : String(date);
    // Use DATE() to be safe with DB date types
    return await this.repo
      .createQueryBuilder("a")
      .where("DATE(a.date) = :date", { date: dateStr })
      .getMany();
  }

  public async findAllByDateAndType(date: Date | string, userType: string): Promise<Attendance[]> {
    const dateStr = date instanceof Date ? date.toISOString().split("T")[0] : String(date);
    return await this.repo
      .createQueryBuilder("a")
      .where("DATE(a.date) = :date", { date: dateStr })
      .andWhere("a.userType = :userType", { userType })
      .getMany();
  }

  public async findByUserIds(userIds: string[]): Promise<Attendance[]> {
    if (!userIds || userIds.length === 0) return [];
    return await this.repo.find({ where: { userId: In(userIds) } });
  }

  public async findByUserIdsAndDate(userIds: string[], date: Date | string): Promise<Attendance[]> {
    if (!userIds || userIds.length === 0) return [];
    const dateStr = date instanceof Date ? date.toISOString().split("T")[0] : String(date);
    return await this.repo
      .createQueryBuilder("a")
      .where("a.userId IN (:...ids)", { ids: userIds })
      .andWhere("DATE(a.date) = :date", { date: dateStr })
      .getMany();
  }

  public async atomicUpdate(query: Partial<Attendance>, updateData: Partial<Attendance>): Promise<Attendance | null> {
    await this.repo.update(query, updateData);
    return this.findOne(query);
  }

  public async deleteOne(query: Partial<Attendance>): Promise<boolean> {
    const result = await this.repo.delete(query as any);
    return (result.affected ?? 0) > 0;
  }
}

export default new AttendanceRepository();