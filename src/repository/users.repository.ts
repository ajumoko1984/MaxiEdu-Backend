import { Not, Repository } from "typeorm";
import { User } from "../entities/user.entity";
import { AppDataSource } from "../config/data-source";
import { IUsers } from "../interfaces/users.interface";
import { ROLE } from "../enums/role.enum";
import APIQuery from "../utils/apiQuery";

class UsersRepository {
  private readonly userRepository: Repository<User>;

  constructor() {
    this.userRepository = AppDataSource.getRepository(User);
  }



    public async create(data: any): Promise<IUsers> {
    const { profileImage } = data;
    if (profileImage) {
      const imageBuffer = Buffer.from(profileImage.base64, "base64");
      data.profileImage = {
        buffer: imageBuffer,
        mimetype: profileImage.mimetype,
      };
    }
    return await this.userRepository.save(data);
  }
  

  // Find all users matching a query
  public async findAll(queryString: any): Promise<IUsers[]> {
    const query = this.userRepository
      .createQueryBuilder("user")
      .where("user.isDeleted = :isDeleted", { isDeleted: false })
      .andWhere("user.accountType != :role", { role: ROLE.SUPER_ADMIN });

    const apiQuery = new APIQuery(query, queryString, "user")
      .filter()
      .sort()
      .limitFields()
      .paginate();

    return await apiQuery.getQuery().getMany();
  }

  // Find a single user matching a query
  public async findOne(query: any): Promise<IUsers | null> {
    return await this.userRepository.findOne({ where: query });
  }

public async findProfileImageById(id: string) {
  return await this.userRepository
    .createQueryBuilder("user")
    .select([
      "user.profileImageBase64",
      "user.profileImageMimeType",
      "user.passportBase64",
      "user.passportMimeType",
    ])
    .where("user.id = :id", { id })
    .andWhere("user.isDeleted = false")
    .getOne();
}



  public async atomicUpdate(
    query: Partial<IUsers>,
    updateData: Partial<User>
  ): Promise<IUsers | null> {
    await this.userRepository.update(query, updateData);
    return this.findOne(query);
  }

  public async deleteOne(query: Partial<IUsers>): Promise<boolean> {
    const result = await this.userRepository.delete(query);
    return (result.affected ?? 0) > 0;
  }
}

export default new UsersRepository();
