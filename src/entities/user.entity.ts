import {
  IsBoolean,
  IsEmail,
  IsEnum,
  IsLowercase,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
} from "class-validator";
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { ROLE } from "../enums/role.enum";


@Entity("users")
export class User {
  @PrimaryGeneratedColumn("uuid")
  @IsString()
  id!: string;

  @Column({ type: "varchar" })
  @IsString()
  @IsNotEmpty()
  @IsLowercase()
  firstName!: string;

  @Column({ type: "varchar" })
  @IsString()
  @IsNotEmpty()
  @IsLowercase()
  lastName!: string;

  @Column({ type: "varchar" })
  @IsEmail()
  @IsNotEmpty()
  @IsLowercase()
  email!: string;

  @Column({ type: "varchar", length: 20, nullable: true })
  @IsOptional()
  @IsPhoneNumber()
  phoneNumber!: number;

  @Column({ type: "varchar" })
  @IsString()
  @IsNotEmpty()
  password!: string;

  @Column({ type: "enum", enum: ROLE })
  @IsEnum(ROLE)
  @IsNotEmpty()
  accountType!: ROLE;

  @Column({ type: "longtext", nullable: true })
  @IsOptional()
  @IsString()
  profileImageBase64?: string;
  
  @Column({ type: "varchar", nullable: true })
  @IsOptional()
  @IsString()
  profileImageMimeType?: string;

@Column({ type: "longtext", nullable: true })
@IsOptional()
@IsString()
passportBase64?: string;

@Column({ type: "varchar", nullable: true })
@IsOptional()
@IsString()
passportMimeType?: string;


  @Column({ type: "boolean", default: true })
  @IsBoolean()
  isDefaultPassword!: boolean;

  @Column({ type: "boolean", default: false })
  @IsBoolean()
  isActive!: boolean;

  @Column({ type: "boolean", default: false })
  isDisabled!: boolean;

  @Column({ type: "boolean", default: false })
  isDeleted!: boolean;

  @Column({ type: "timestamp", default: null })
  @IsOptional()
  lastLogin!: Date;

  @Column({ type: "int", default: 0 })
  loginCount!: number;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  createdAt!: Date;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  updatedAt!: Date;
}
