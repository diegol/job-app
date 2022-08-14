import { ListJobInputDto } from "./jobs/dto/list-job-input.dto";
import { ListJobOutputDto } from "./jobs/dto/list-job-output.dto";

import { CreateJobInputDto } from "./jobs/dto/create-job-input.dto";
import { CreateNoteInputDto } from "./notes/dto/create-note-input.dto";
import { UpdateNoteInputDto } from "./notes/dto/update-note-input.dto";
import { Job, JobStatus } from "./entity/Job";
import { Note } from "./entity/Note";
import { Logger } from "./common/functionCommon";
import { MetricsInterface } from "@aws-lambda-powertools/metrics";

/**** Jobs interfaces ([TODO] should be split in a seeparate file) ****/
export interface JobRepositoryInterface {
  create(jobData: CreateJobInputDto): Promise<Job>;

  findList(listJobDto: ListJobInputDto): Promise<[Job[], number]>;

  findByJobId(jobId: string): Promise<Job>;

  updateStatusByJobId(jobId: string, status: JobStatus);
}

export interface JobServiceInterface {
  createJob({ jobData }: { jobData: CreateJobInputDto }): Promise<Job>;

  listJobs(listJobDto: ListJobInputDto): Promise<ListJobOutputDto>;

  updateJobStatus(data: any, jobId: string): Promise<boolean>;
}
/**** Note interfaces ([TODO] should be split in a seeparate file) ****/
export interface NoteRepositoryInterface {
  create(job: Job, noteData: CreateNoteInputDto): Note;

  findList(jobId: string): Promise<Note[]>;

  findByNoteId(noteId: string): Promise<Note>;

  updateNoteByNoteId(noteId: string, noteData: UpdateNoteInputDto): boolean;
}

export interface NoteServiceInterface {
  createNote(jobId: string, noteData: CreateNoteInputDto): Promise<Note>;

  updateJobStatus(data: any, jobId: string): Promise<boolean>;

  updateNote(
    jobId: string,
    noteId: string,
    noteData: UpdateNoteInputDto
  ): Promise<boolean>;
}

/*** System wide interfaces ****/
export interface ApplicationLoggerInterface {
  getInstance(): Logger;
}
export interface ApplicationMetricsInterface {
  getInstance(): MetricsInterface;
}
export interface CreateDataSourceInterface {
  getDataSource();
}
