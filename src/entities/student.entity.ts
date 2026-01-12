import {
  IsString,
  IsUUID,
  IsNotEmpty,
  IsOptional,
  IsEmail,
  IsPhoneNumber,
  IsBoolean,
} from "class-validator";
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, BeforeInsert, BeforeUpdate } from "typeorm";
import { School } from "./school.entity";
import { Parent } from './parent.entity';

@Entity("students")
export class Student {
  @PrimaryGeneratedColumn("uuid")
  @IsUUID()
  id!: string;

  @ManyToOne(() => School, (school) => school.students, { cascade: true })
  @JoinColumn({ name: "schoolId" })
  school!: School;

  @Column({ type: "uuid" })
  @IsUUID()
  @IsNotEmpty()
  schoolId!: string;

  @Column({ type: "varchar" })
  @IsString()
  @IsNotEmpty()
  firstName!: string;

  @Column({ type: "varchar" })
  @IsString()
  @IsOptional()
  otherNames?: string;

  @Column({ type: "varchar" })
  @IsString()
  @IsNotEmpty()
  lastName!: string;

  @Column({ type: "varchar", unique: true, nullable: true })
  @IsEmail()
  @IsOptional()
  email?: string;

  @Column({ type: "varchar", nullable: true })
  @IsOptional()
  @IsPhoneNumber()
  phoneNumber?: string;

  @Column({ type: "varchar", nullable: true })
  @IsOptional()
  @IsString()
  studentId?: string;


@Column({ type: "longtext", nullable: true })
@IsOptional()
@IsString()
profileImageBase64?: string;

@Column({ type: "varchar", nullable: true })
@IsOptional()
@IsString()
profileImageMimeType?: string;

@Column({ type: "longtext", nullable: true })
@IsOptional()
@IsString()
passportBase64?: string;

@Column({ type: "varchar", nullable: true })
@IsOptional()
@IsString()
passportMimeType?: string;

  @Column({ type: "varchar", nullable: true })
  @IsOptional()
  @IsString()
  classAssigned?: string;

  @Column({ type: "varchar", nullable: true })
  @IsOptional()
  @IsString()
  parentName?: string;

  @Column({ type: "varchar", nullable: true })
  @IsOptional()
  @IsPhoneNumber()
  parentPhone?: string;

  @Column({ type: "varchar", nullable: true })
  @IsOptional()
  @IsString()
  address?: string;

  @Column({ type: "varchar", nullable: true })
  @IsOptional()
  @IsString()
  placeOfBirth?: string;

  @Column({ type: "varchar", nullable: true })
  @IsOptional()
  @IsString()
  nationality?: string;

  @Column({ type: "varchar", nullable: true })
  @IsOptional()
  @IsString()
  stateOfOrigin?: string;

  @Column({ type: "varchar", nullable: true })
  @IsOptional()
  @IsString()
  lga?: string;

  @Column({ type: "varchar", nullable: true })
  @IsOptional()
  @IsString()
  religion?: string;

  @Column({ type: "varchar", nullable: true })
  @IsOptional()
  @IsString()
  bloodGroup?: string;

  @Column({ type: "varchar", nullable: true })
  @IsOptional()
  @IsString()
  genotype?: string;

  @Column({ type: "varchar", nullable: true })
  @IsOptional()
  @IsString()
  previousSchool?: string;

  @Column({ type: "varchar", nullable: true, default: 'Active' })
  @IsOptional()
  @IsString()
  status?: string;

  @Column({ type: "text", nullable: true })
  @IsOptional()
  @IsString()
  knownMedicalConditions?: string;

  @Column({ type: "text", nullable: true })
  @IsOptional()
  @IsString()
  allergies?: string;

  @Column({ type: "text", nullable: true })
  @IsOptional()
  @IsString()
  specialNeeds?: string;

  @Column({ type: "varchar", nullable: true })
  @IsOptional()
  @IsString()
  emergencyContactName?: string;

  @Column({ type: "varchar", nullable: true })
  @IsOptional()
  @IsPhoneNumber()
  emergencyContactPhone?: string;

  @Column({ type: "varchar", nullable: true })
  @IsOptional()
  @IsString()
  homeAddress?: string;

  @Column({ type: "date", nullable: true })
  @IsOptional()
  dateOfBirth?: Date;

  @Column({ type: "varchar", nullable: true })
  @IsOptional()
  @IsString()
  gender?: string;

  @Column({ type: "int", nullable: true })
  @IsOptional()
  age?: number;

  @Column({ type: "json", nullable: true })
  @IsOptional()
  faceDescriptor?: number[];

  
  @Column({ type: "boolean", default: false })
  @IsBoolean()
  faceEnrolled!: boolean;

  @Column({ type: "varchar", nullable: true })
  @IsOptional()
  @IsString()
  rfid?: string;

  @Column({ type: "boolean", default: true })
  @IsBoolean()
  isActive!: boolean;

  @Column({ type: "boolean", default: false })
  @IsBoolean()
  isDisabled!: boolean;

  @Column({ type: "boolean", default: false })
  @IsBoolean()
  isDeleted!: boolean;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  createdAt!: Date;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  updatedAt!: Date;

  @BeforeInsert()
  @BeforeUpdate()
  setDerivedFields() {
    if (this.dateOfBirth) {
      const dob = new Date(this.dateOfBirth);
      const now = new Date();
      let age = now.getFullYear() - dob.getFullYear();
      const m = now.getMonth() - dob.getMonth();
      if (m < 0 || (m === 0 && now.getDate() < dob.getDate())) {
        age--;
      }
      this.age = age;
    }
  }
}
