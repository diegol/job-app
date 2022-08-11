import { Container } from "inversify";
import TYPES from "./types";
import { CreateDataSource } from "./common/data-source";

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
import { ApplicationLogger } from "./common/application-logger";
import { ApplicationMetrics } from "./common/application-metrics";
import { CreateJob } from "./jobs/functions/lambda-post-job";
import { JobService } from "../src/jobs/job.service";
import { ListJobs } from "./jobs/functions/lambda-get-job-list";

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

container.bind<ListJobs>(TYPES.ListJobs).to(ListJobs);

container.bind<JobServiceInterface>(TYPES.JobService).to(JobService);

container.bind<CreateJob>(TYPES.CreateJob).to(CreateJob);

container
  .bind<NoteRepositoryInterface>(TYPES.NoteRepository)
  .to(NoteRepository);

container.bind<NoteServiceInterface>(TYPES.NoteService).to(NoteService);

export default container;
