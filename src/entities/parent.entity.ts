import { IsString, IsUUID, IsNotEmpty, IsOptional, IsEmail, IsPhoneNumber } from "class-validator";
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany } from "typeorm";
import { School } from "./school.entity";

@Entity("parents")
export class Parent {
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

  @Column({ type: "varchar" })
  @IsString()
  @IsNotEmpty()
  fullName!: string;

  @Column({ type: "varchar", nullable: true })
  @IsOptional()
  @IsString()
  relationship?: string;

  @Column({ type: "varchar", nullable: true })
  @IsOptional()
  @IsEmail()
  email?: string;

  @Column({ type: "varchar", nullable: true })
  @IsOptional()
  @IsPhoneNumber()
  phonePrimary?: string;

  @Column({ type: "varchar", nullable: true })
  @IsOptional()
  @IsPhoneNumber()
  phoneAlternative?: string;

  @Column({ type: "varchar", nullable: true })
  @IsOptional()
  @IsString()
  homeAddress?: string;

  @Column({ type: "varchar", nullable: true })
  @IsOptional()
  @IsString()
  occupation?: string;

  @Column({ type: "varchar", nullable: true })
  @IsOptional()
  @IsString()
  placeOfWork?: string;

  @Column({ type: "varchar", nullable: true })
  @IsOptional()
  @IsString()
  password?: string;


  @Column({ type: "boolean", default: true })
  isActive!: boolean;

  @Column({ type: "boolean", default: false })
  isDeleted!: boolean;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  createdAt!: Date;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  updatedAt!: Date;
}


