import { injectable, inject } from "inversify";
import TYPES from "../types";

import { ClassThatLogs } from "@aws-lambda-powertools/logger";
import { MetricUnits, MetricsInterface } from "@aws-lambda-powertools/metrics";

/*** interfaces ***/
import {
  ApplicationLoggerInterface,
  ApplicationMetricsInterface,
  JobRepositoryInterface,
  JobServiceInterface,
} from "../interfaces";

//**** DTOs ****/
import { ListJobOutputDto } from "./dto/list-job-output.dto";
import { CreateJobInputDto } from "./dto/create-job-input.dto";
import { ListJobInputDto } from "./dto/list-job-input.dto";
import { Job, JobStatus } from "../entity/Job";

@injectable()
export class JobService implements JobServiceInterface {
  private _jobRepository: JobRepositoryInterface;
  private _logger: ClassThatLogs;
  private _metrics: MetricsInterface;

  /**
   * Injecting dependencies
   */
  constructor(
    @inject(TYPES.JobRepository)
    jobRepository: JobRepositoryInterface,
    @inject(TYPES.ApplicationLogger)
    applicationLogger: ApplicationLoggerInterface,
    @inject(TYPES.ApplicationMetrics)
    applicationMetrics: ApplicationMetricsInterface
  ) {
    this._jobRepository = jobRepository;
    this._logger = applicationLogger.getInstance();
    this._metrics = applicationMetrics.getInstance();
  }
  /**
   *  Create a Job
   */
  async createJob({ jobData }: { jobData: CreateJobInputDto }): Promise<Job> {
    const job = await this._jobRepository.create(jobData);

    //Creating a cloud watch metric for how many jobs were created
    this._metrics.addMetric("jobCreated", MetricUnits.Count, 1);
    this._metrics.publishStoredMetrics();

    return job;
  }

  /**
   *  List Jobs paginated
   */
  async listJobs(listJobDto: ListJobInputDto): Promise<ListJobOutputDto> {
    this._logger.info("listJobs DTO");
    console.log(listJobDto);

    const [jobs, totalRecordsCount] = await this._jobRepository.findList(
      listJobDto
    );

    //Creating a cloud watch metric for how many jobs were created
    this._metrics.addMetric("jobListViews", MetricUnits.Count, 1);
    this._metrics.publishStoredMetrics();
    return {
      metadata: {
        totalRecordsCount,
        pageSize: listJobDto.pageSize!,
        offset: listJobDto.offset!,
      },
      jobs,
    };
  }

  async updateJobStatus(status: JobStatus, jobId: string): Promise<boolean> {
    const job = await this._jobRepository.findByJobId(jobId);
    if (job == null) {
      return false;
    }
    console.log(job);
    await this._jobRepository.updateStatusByJobId(jobId, status);
    return true;
  }
}
