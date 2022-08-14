import { Container } from "inversify";
import TYPES from "./types";

import { JobRepository } from "./repositories/job.repository";
import {
  JobRepositoryInterface,
  ApplicationLoggerInterface,
  CreateDataSourceInterface,
  ApplicationMetricsInterface,
  JobServiceInterface,
  NoteRepositoryInterface,
  NoteServiceInterface,
} from "./interfaces";

import {
  ApplicationLogger,
  ApplicationMetrics,
  CreateDataSource,
} from "./common";

import { JobService } from "../src/jobs/job.service";

import { NoteRepository } from "./repositories/note.repository";
import { NoteService } from "./notes/note.service";

var container = new Container();
container
  .bind<CreateDataSourceInterface>(TYPES.CreateDataSource)
  .to(CreateDataSource);
container.bind<JobRepositoryInterface>(TYPES.JobRepository).to(JobRepository);
container
  .bind<ApplicationLoggerInterface>(TYPES.ApplicationLogger)
  .to(ApplicationLogger);
container
  .bind<ApplicationMetricsInterface>(TYPES.ApplicationMetrics)
  .to(ApplicationMetrics);

container.bind<JobServiceInterface>(TYPES.JobService).to(JobService);

container
  .bind<NoteRepositoryInterface>(TYPES.NoteRepository)
  .to(NoteRepository);

container.bind<NoteServiceInterface>(TYPES.NoteService).to(NoteService);

export default container;
