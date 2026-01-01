import { IsString, IsUUID, IsOptional, IsDate, IsBoolean } from "class-validator";
import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity("sessions")
export class Session {
  @PrimaryGeneratedColumn("uuid")
  @IsUUID()
  id!: string;

  @Column({ type: "varchar" })
  @IsString()
  sessionName!: string;

  @Column({ type: "date", nullable: true })
  @IsOptional()
  startDate?: Date;

  @Column({ type: "date", nullable: true })
  @IsOptional()
  endDate?: Date;

  @Column({ type: "boolean", default: false })
  @IsBoolean()
  isOpen!: boolean;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  createdAt!: Date;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  updatedAt!: Date;
}
