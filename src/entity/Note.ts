import {
  Entity,
  BaseEntity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from "typeorm";

import { Job } from "./Job";

@Entity()
export class Note extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column("text")
  description: string;

  /** anotations for automatic values update */
  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  /*** Relations ***/
  @ManyToOne(() => Job, (job) => job.notes)
  job: Job;
}
