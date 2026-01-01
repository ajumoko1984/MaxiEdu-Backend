import { IsString, IsUUID, IsOptional, IsNumber } from "class-validator";
import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity("grades")
export class Grade {
  @PrimaryGeneratedColumn("uuid")
  @IsUUID()
  id!: string;

  @Column({ type: "varchar" })
  @IsString()
  grade!: string;

  @Column({ type: "int" })
  @IsNumber()
  min!: number;

  @Column({ type: "int" })
  @IsNumber()
  max!: number;

  @Column({ type: "varchar", nullable: true })
  @IsOptional()
  description?: string;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  createdAt!: Date;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  updatedAt!: Date;
}
