import { IsString, IsUUID, IsOptional, IsNumber } from "class-validator";
import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity("scores")
export class Score {
  @PrimaryGeneratedColumn("uuid")
  @IsUUID()
  id!: string;

  @Column({ type: "varchar", nullable: true })
  @IsOptional()
  scoreId?: string;

  @Column({ type: "uuid", nullable: true })
  @IsOptional()
  subjectId?: string;

  @Column({ type: "uuid", nullable: true })
  @IsOptional()
  studentId?: string;

  @Column({ type: "uuid", nullable: true })
  @IsOptional()
  classId?: string;

  @Column({ type: "uuid", nullable: true })
  @IsOptional()
  examId?: string;

  @Column({ type: "uuid", nullable: true })
  @IsOptional()
  sessionId?: string;

  @Column({ type: "float", default: 0 })
  firstCA!: number;

  @Column({ type: "float", default: 0 })
  secondCA!: number;

  @Column({ type: "float", default: 0 })
  exam!: number;

  @Column({ type: "float", default: 0 })
  total!: number;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  createdAt!: Date;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  updatedAt!: Date;
}
