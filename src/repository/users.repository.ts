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

  // Create a new user
  public async create({
    firstName,
    lastName,
    email,
    password,
    accountType,
    isDefaultPassword,
    isActive,
  }: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    accountType: ROLE;
    isDefaultPassword?: boolean;
    isActive?: boolean;
  }) {
    return await this.userRepository.save({
      firstName,
      lastName,
      email,
      password,
      accountType,
      isDefaultPassword,
      isActive,
    });
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
