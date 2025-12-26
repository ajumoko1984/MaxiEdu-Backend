import {
  IsString,
  IsUUID,
  IsNotEmpty,
  IsOptional,
  IsEmail,
  IsPhoneNumber,
  IsBoolean,
} from "class-validator";
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { School } from "./school.entity";

@Entity("students")
export class Student {
  @PrimaryGeneratedColumn("uuid")
  @IsUUID()
  id!: string;

  @Column({ type: "uuid" })
  @IsUUID()
  @IsNotEmpty()
  schoolId!: string;

  @ManyToOne(() => School)
  @JoinColumn({ name: "schoolId" })
  school?: School;

  @Column({ type: "varchar" })
  @IsString()
  @IsNotEmpty()
  firstName!: string;

  @Column({ type: "varchar" })
  @IsString()
  @IsNotEmpty()
  lastName!: string;

  @Column({ type: "varchar", unique: true })
  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @Column({ type: "varchar", nullable: true })
  @IsOptional()
  @IsPhoneNumber()
  phoneNumber?: string;

  @Column({ type: "varchar", nullable: true })
  @IsOptional()
  @IsString()
  studentId?: string;

  @Column({ type: "varchar", nullable: true })
  @IsOptional()
  @IsString()
  classAssigned?: string;

  @Column({ type: "varchar", nullable: true })
  @IsOptional()
  @IsString()
  parentName?: string;

  @Column({ type: "varchar", nullable: true })
  @IsOptional()
  @IsPhoneNumber()
  parentPhone?: string;

  @Column({ type: "varchar", nullable: true })
  @IsOptional()
  @IsString()
  address?: string;

  @Column({ type: "boolean", default: true })
  @IsBoolean()
  isActive!: boolean;

  @Column({ type: "boolean", default: false })
  @IsBoolean()
  isDisabled!: boolean;

  @Column({ type: "boolean", default: false })
  @IsBoolean()
  isDeleted!: boolean;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  createdAt!: Date;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  updatedAt!: Date;
}
