import { ROLE } from "../enums/role.enum";
export interface CreateUserDto {
  firstName: string;
  lastName: string;
  email: string;
  role: ROLE;
  password: string;
}

export interface LoginUserDto {
  email: string;
  password: string;
}

export interface ChangePasswordDto {
  oldPassword: string;
  newPassword: string;
}
