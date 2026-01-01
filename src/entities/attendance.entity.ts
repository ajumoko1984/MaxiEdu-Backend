import { IsString, IsUUID, IsOptional, IsDate, IsNumber } from "class-validator";
import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity("attendances")
export class Attendance {
  @PrimaryGeneratedColumn("uuid")
  @IsUUID()
  id!: string;

  @Column({ type: "uuid" })
  @IsUUID()
  userId!: string;

  @Column({ type: "varchar" })
  @IsString()
  userType!: string; // student | teacher | staff

  @Column({ type: "date" })
  date!: Date;

  @Column({ type: "varchar", default: "present" })
  status!: string; // present | absent | late | excused

  @Column({ type: "time", nullable: true })
  @IsOptional()
  checkInTime?: string;

  @Column({ type: "time", nullable: true })
  @IsOptional()
  checkOutTime?: string;

  @Column({ type: "varchar", nullable: true })
  @IsOptional()
  method?: string; // manual | biometric | face | card | QR

  @Column({ type: "uuid", nullable: true })
  @IsOptional()
  markedBy?: string;

  @Column({ type: "text", nullable: true })
  @IsOptional()
  remarks?: string;

  @Column({ type: "float", nullable: true })
  @IsOptional()
  confidenceScore?: number;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  createdAt!: Date;
}
