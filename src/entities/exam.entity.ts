import { IsString, IsUUID, IsOptional } from "class-validator";
import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity("exams")
export class Exam {
  @PrimaryGeneratedColumn("uuid")
  @IsUUID()
  id!: string;

  @Column({ type: "varchar" })
  @IsString()
  name!: string;

  @Column({ type: "uuid", nullable: true })
  @IsOptional()
  sessionId?: string;

  @Column({ type: "varchar", nullable: true })
  @IsOptional()
  description?: string;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  createdAt!: Date;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  updatedAt!: Date;
}
