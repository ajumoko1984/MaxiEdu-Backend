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

@Entity("transport_routes")
export class Transport {
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
  routeName!: string;

  @Column({ type: "varchar", nullable: true })
  @IsOptional()
  @IsString()
  startPoint?: string;

  @Column({ type: "varchar", nullable: true })
  @IsOptional()
  @IsString()
  endPoint?: string;

  @Column({ type: "text", nullable: true })
  @IsOptional()
  @IsString()
  stops?: string;

  @Column({ type: "varchar", nullable: true })
  @IsOptional()
  @IsString()
  vehicleNumber?: string;

  @Column({ type: "varchar", nullable: true })
  @IsOptional()
  @IsString()
  driverName?: string;

  @Column({ type: "varchar", nullable: true })
  @IsOptional()
  @IsString()
  driverPhone?: string;

  @Column({ type: "int", default: 0 })
  @IsNumber()
  capacity!: number;

  @Column({ type: "decimal", nullable: true })
  @IsOptional()
  monthlyFee?: number;

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
