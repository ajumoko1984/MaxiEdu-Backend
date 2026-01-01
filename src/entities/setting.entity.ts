import { IsString, IsUUID, IsOptional } from "class-validator";
import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity("settings")
export class Setting {
  @PrimaryGeneratedColumn("uuid")
  @IsUUID()
  id!: string;

  @Column({ type: "varchar" })
  @IsString()
  settingKey!: string;

  @Column({ type: "varchar", nullable: true })
  @IsOptional()
  @IsString()
  value?: string;

  @Column({ type: "varchar", nullable: true })
  @IsOptional()
  @IsString()
  themeColor?: string;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  createdAt!: Date;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  updatedAt!: Date;
}
