import { ROLE } from "../enums/role.enum";
export interface IUsers {
  id: string;
  firstName: string;
  lastName: string;
  password: string;
  email: string;
  phoneNumber?: number;
  isActive: boolean;
  accountType?: ROLE;
  isDefaultPassword: boolean;
  lastLogin?: Date;
  loginCount?: number;
  isDisabled: boolean;
  isDeleted: boolean;
}
