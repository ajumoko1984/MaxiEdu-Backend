import { IsString, IsUUID, IsOptional, IsNumber } from "class-validator";
import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity("library")
export class Library {
  @PrimaryGeneratedColumn("uuid")
  @IsUUID()
  id!: string;

  @Column({ type: "int" })
  @IsNumber()
  quantity!: number;



  @Column({ type: "varchar" })
  @IsOptional()
  bookName?: string;

  @Column({ type: "varchar" })
  @IsOptional()
  available?: string;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  createdAt!: Date;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  updatedAt!: Date;
}
