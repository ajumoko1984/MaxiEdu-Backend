import { IsString, IsUUID, IsOptional } from "class-validator";
import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity("materials")
export class Material {
  @PrimaryGeneratedColumn("uuid")
  @IsUUID()
  id!: string;

  @Column({ type: "uuid" })
  @IsUUID()
  schoolId!: string;

  @Column({ type: "varchar" })
  @IsString()
  title!: string;

  @Column({ type: "text", nullable: true })
  @IsOptional()
  @IsString()
  description?: string;

  @Column({ type: "varchar", nullable: true })
  @IsOptional()
  @IsString()
  fileUrl?: string;

  @Column({ type: "varchar", nullable: true })
  @IsOptional()
  @IsString()
  fileType?: string; // pdf, video, assignment

  @Column({ type: "varchar", nullable: true })
  @IsOptional()
  @IsString()
  uploadedBy?: string;

  @Column({ type: "boolean", default: true })
  isActive!: boolean;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  createdAt!: Date;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  updatedAt!: Date;
}
