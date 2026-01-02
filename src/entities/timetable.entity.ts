import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";
import { IsString, IsUUID, IsOptional } from "class-validator";

@Entity("timetable")
export class Timetable {
  @PrimaryGeneratedColumn("uuid")
  @IsUUID()
  id!: string;

  @Column({ type: "varchar" })
  @IsString()
  day!: string;

  @Column({ type: "varchar" })
  @IsString()
  startTime!: string;

  @Column({ type: "varchar" })
  @IsString()
  endTime!: string;

  @Column({ type: "varchar" })
  @IsString()
  subject!: string;

  @Column({ type: "varchar", nullable: true })
  @IsOptional()
  teacher?: string;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  createdAt!: Date;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  updatedAt!: Date;
}