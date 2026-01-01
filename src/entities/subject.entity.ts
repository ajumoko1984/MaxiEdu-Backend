import {
  IsString,
  IsUUID,
  IsNotEmpty,
  IsOptional,
  IsBoolean,
} from "class-validator";
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { School } from "./school.entity";

@Entity("subjects")
export class Subject {
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

  @Column({ type: "varchar", unique: true })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @Column({ type: "varchar", nullable: true })
  @IsOptional()
  @IsString()
  code?: string;

  @Column({ type: "uuid", nullable: true })
  @IsOptional()
  @IsUUID()
  classId?: string;

  @Column({ type: "text", nullable: true })
  @IsOptional()
  @IsString()
  description?: string;

  @Column({ type: "varchar", nullable: true })
  @IsOptional()
  @IsUUID()
  departmentHeadId?: string;

  @Column({ type: "int", default: 0 })
  totalClasses!: number;

  @Column({ type: "boolean", default: true })
  @IsBoolean()
  isActive!: boolean;

  @Column({ type: "boolean", default: false })
  @IsBoolean()
  isDeleted!: boolean;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  createdAt!: Date;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  updatedAt!: Date;
}
