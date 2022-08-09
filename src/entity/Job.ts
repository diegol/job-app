import {
  Entity,
  BaseEntity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from "typeorm";

import { Note } from "./Note";

export enum JobStatus {
  "scheduled",
  "active",
  "invoicing",
  "to-priced",
  "completed",
}
@Entity()
export class Job extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column("text")
  firstName: string;

  @Column("text")
  lastName: string;

  @Column("text")
  mobileNumber: string;

  @Column("text")
  address: string;

  @Column("text")
  email: string;

  @Column({
    type: "enum",
    enum: ["scheduled", "active", "invoicing", "to priced", "completed"],
    // deafult: "scheduled",
  })
  status: JobStatus;

  /** anotations for automatic values update */
  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  /*** Relations ***/
  @OneToMany(() => Note, (note) => note.job)
  notes: Note[];
}
