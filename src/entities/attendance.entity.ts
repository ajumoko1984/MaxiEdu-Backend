import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from "typeorm";
import { AttendanceType } from "../enums/role.enum";
import { IsNotEmpty, IsUUID } from "class-validator";

@Entity("attendances")
export class Attendance {
  @PrimaryGeneratedColumn("uuid")
  id?: string;

   @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  checkInTime?: Date;

  @Column({ type: "timestamp", nullable: true })
  checkOutTime?: Date | null;

  @Column({ type: "float", nullable: true })
  faceRecognitionScore?: number | null;

  @Column({
    type: "enum",
    enum: AttendanceType,
  })
  type?: AttendanceType;

  @Column({ type: "uuid" })
  @IsUUID()
  @IsNotEmpty()
  personId?: string;

  @Column({ type: "uuid" })
  @IsUUID()
  @IsNotEmpty()
  attenderId?: string;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  createdAt!: Date;
}
