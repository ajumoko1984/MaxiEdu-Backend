import {
  IsString,
  IsEmail,
  IsPhoneNumber,
  IsOptional,
  IsNotEmpty,
  IsBoolean,
} from "class-validator";
import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity("schools")
export class School {
  @PrimaryGeneratedColumn("uuid")
  @IsString()
  id!: string;

  @Column({ type: "varchar", unique: true })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @Column({ type: "varchar", nullable: true })
  @IsOptional()
  @IsString()
  address?: string;

  @Column({ type: "varchar", nullable: true })
  @IsOptional()
  @IsPhoneNumber()
  phoneNumber?: string;

  @Column({ type: "varchar", nullable: true })
  @IsOptional()
  @IsEmail()
  email?: string;

  @Column({ type: "varchar", nullable: true })
  @IsOptional()
  @IsString()
  website?: string;

  @Column({ type: "varchar", nullable: true })
  @IsOptional()
  @IsString()
  principalName?: string;

  @Column({ type: "text", nullable: true })
  @IsOptional()
  @IsString()
  description?: string;

  @Column({ type: "varchar", nullable: true })
  @IsOptional()
  @IsString()
  registrationNumber?: string;

  @Column({ type: "varchar", nullable: true })
  @IsOptional()
  @IsString()
  state?: string;

  @Column({ type: "varchar", nullable: true })
  @IsOptional()
  @IsString()
  city?: string;

  @Column({ type: "boolean", default: true })
  @IsBoolean()
  isActive!: boolean;

  @Column({ type: "boolean", default: false })
  @IsBoolean()
  isDisabled!: boolean;

  @Column({ type: "boolean", default: false })
  @IsBoolean()
  isDeleted!: boolean;

  @Column({ type: "int", default: 0 })
  totalStudents!: number;

  @Column({ type: "int", default: 0 })
  totalTeachers!: number;

  @Column({ type: "int", default: 0 })
  totalStaff!: number;

  @Column({ type: "int", default: 0 })
  totalClasses!: number;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  createdAt!: Date;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  updatedAt!: Date;
}
