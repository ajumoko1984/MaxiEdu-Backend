import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Subject } from './subject.entity';
import { Teacher } from './teacher.entity';
import { IsBoolean, IsNotEmpty, IsString, IsUUID } from 'class-validator';

@Entity()
export class Elearning {
  @PrimaryGeneratedColumn("uuid")
  @IsUUID()
  id!: string;

  @Column({ type: "varchar" })
  @IsString()
  @IsNotEmpty()
  title!: string;

  @Column({ nullable: true })
  description?: string;

  @Column({ nullable: true })
  coverImage?: string;

  @ManyToOne(() => Subject, { nullable: true })
  subject?: Subject;

  @ManyToOne(() => Teacher, { nullable: true })
  tutor?: Teacher;

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