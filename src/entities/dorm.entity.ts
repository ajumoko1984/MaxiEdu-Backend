import {
  IsString,
  IsUUID,
  IsNotEmpty,
  IsOptional,
  IsBoolean,
  IsNumber,
} from "class-validator";
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { School } from "./school.entity";

@Entity("dorms")
export class Dorm {
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
  dormType?: string;

  @Column({ type: "int", default: 0 })
  @IsNumber()
  capacity!: number;

  @Column({ type: "int", default: 0 })
  @IsNumber()
  occupancy!: number;

  @Column({ type: "varchar", nullable: true })
  @IsOptional()
  @IsUUID()
  dormMasterId?: string;

  @Column({ type: "text", nullable: true })
  @IsOptional()
  @IsString()
  rules?: string;

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
