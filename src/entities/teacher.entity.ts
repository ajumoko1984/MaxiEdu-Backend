import {
  IsString,
  IsUUID,
  IsNotEmpty,
  IsOptional,
  IsEmail,
  IsPhoneNumber,
  IsEnum,
  IsBoolean,
  IsNumber,
} from "class-validator";
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { School } from "./school.entity";

@Entity("teachers")
export class Teacher {
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
  employeeId?: string;

  @Column({ type: "varchar", nullable: true })
  @IsOptional()
  @IsString()
  qualification?: string;

  @Column({ type: "simple-array", nullable: true })
  @IsOptional()
  subject?: string[];

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
