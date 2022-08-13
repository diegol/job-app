import { injectable, inject } from "inversify";
import TYPES from "../types";
import { CreateDataSource } from "../common/data-source";
import { Logger } from "@aws-lambda-powertools/logger";
import {
  ApplicationLoggerInterface,
  CreateDataSourceInterface,
} from "../interfaces";

import { Job, JobStatus } from "../entity/Job";

@injectable()
export class JobRepository {
  private _createDatasource: CreateDataSource;
  private _applicationLogger: Logger;

  constructor(
    @inject(TYPES.CreateDataSource)
    public createDatasource: CreateDataSourceInterface,
    @inject(TYPES.ApplicationLogger)
    public applicationLogger: ApplicationLoggerInterface
  ) {
    this._createDatasource = createDatasource;
    this._applicationLogger = applicationLogger.getInstance();
  }

  private _getRepository = async () => {
    const dataSource = await this._createDatasource.getDataSource();
    return dataSource.manager.getRepository(Job);
  };

  async create(jobData: CreateJobDto): Promise<Job> {
    const repository = await this._getRepository();

    const job = repository.create(jobData);
    this._applicationLogger.error("CreateJobDto");
    this._applicationLogger.error("Exception ", { message: "CreateJobDto" });
    return repository.save(job);
  }

  /**
   * Get Jobs paginated with offset/pageSize
   * also can be filter by
   *  - firstName
   *  - lastName
   *
   *  and also support sorting
   */
  async findList(listJobDto: ListJobDto): Promise<[Job[], number]> {
    const repository = await this._getRepository();
    const query = repository
      .createQueryBuilder("Job")
      .skip(listJobDto.offset)
      .take(listJobDto.pageSize);

    if (listJobDto.firstName !== undefined) {
      query.andWhere("Job.firstName like :firstName", {
        firstName: `%${listJobDto.firstName}%`,
      });
    }
    if (listJobDto.lastName !== undefined) {
      query.andWhere("Job.lastName like :lastName", {
        lastName: `%${listJobDto.lastName}%`,
      });
    }
    if (
      (listJobDto.orderBy !== undefined && listJobDto.sortBy !== undefined) ||
      1
    ) {
      query.orderBy("Job_" + listJobDto.orderBy, "ASC");
    }

    console.log(query.getSql());
    return query.getManyAndCount();
  }

  /**
   * Return a specific job with all the notes if any
   */
  async findByJobId(jobId: string) {
    console.log("jobId", jobId);

    return (await this._getRepository())
      .createQueryBuilder("Job")
      .leftJoinAndSelect("Job.notes", "notes")
      .where("Job.id = :jobId", { jobId })
      .getOne();
  }

  async updateStatusByJobId(jobId: string, status: JobStatus) {
    console.log("status", status);
    return (await this._getRepository())
      .createQueryBuilder()
      .update(Job)
      .set({ status: status.status })
      .where("id = :jobId", { jobId })
      .execute();
  }
}
