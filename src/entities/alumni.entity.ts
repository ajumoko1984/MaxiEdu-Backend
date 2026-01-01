import { IsString, IsUUID, IsOptional } from "class-validator";
import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity("alumni")
export class Alumni {
  @PrimaryGeneratedColumn("uuid")
  @IsUUID()
  id!: string;

  @Column({ type: "varchar" })
  @IsString()
  fullName!: string;

  @Column({ type: "varchar", nullable: true })
  @IsOptional()
  @IsString()
  yearGraduated?: string;

  @Column({ type: "varchar", nullable: true })
  @IsOptional()
  @IsString()
  currentOccupation?: string;

  @Column({ type: "varchar", nullable: true })
  @IsOptional()
  @IsString()
  contact?: string;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  createdAt!: Date;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  updatedAt!: Date;
}
