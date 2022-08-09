import "reflect-metadata";
import { JobService } from "../job.service";
import { describe, it, expect, vi } from "vitest";
import { faker } from "@faker-js/faker";
import {
  JobRepositoryInterface,
  JobServiceInterface,
  ApplicationLoggerInterface,
  ApplicationMetricsInterface,
} from "../../interfaces";
import { CreateJobInputDto } from "../dto/create-job-input.dto";
import { ListJobInputDto } from "../dto/list-job-input.dto";
import { Job, JobStatus } from "../../entity/Job";
import { Container } from "inversify";
import { injectable, inject } from "inversify";
import TYPES from "../../types";
import { ApplicationMetrics } from "../../ common/application-metrics";

describe("jobs", () => {
  it("Create a Job and should return the object created", async () => {
    let createJobInputDto: CreateJobInputDto;
    const jobReturnedFromRepo = new Job();
    jobReturnedFromRepo.id = faker.datatype.uuid();
    jobReturnedFromRepo.firstName = faker.internet.userName();
    jobReturnedFromRepo.email = faker.internet.email();

    /*** Mock some objects ***/
    @injectable()
    class JobRepositoryMock implements JobRepositoryInterface {
      create(jobData: CreateJobInputDto): Promise<Job> {
        return Promise.resolve(jobReturnedFromRepo);
      }

      findList(listJobDto: ListJobInputDto): Promise<[Job[], number]> {
        return null;
      }

      findByJobId(jobId: string): Promise<Job> {
        return null;
      }

      updateStatusByJobId(jobId: string, status: JobStatus) {
        return null;
      }
    }

    @injectable()
    class ApplicationLoggerMock implements ApplicationLoggerInterface {
      getInstance() {}
    }

    /*** bind to a new container ****/
    const myContainer = new Container();
    myContainer
      .bind<JobRepositoryInterface>(TYPES.JobRepository)
      .to(JobRepositoryMock);
    myContainer
      .bind<ApplicationLoggerInterface>(TYPES.ApplicationLogger)
      .to(ApplicationLoggerMock);
    myContainer
      .bind<ApplicationMetricsInterface>(TYPES.ApplicationMetrics)
      .to(ApplicationMetrics);

    myContainer.bind<JobServiceInterface>(TYPES.JobService).to(JobService);

    const jobService = await myContainer.get<JobServiceInterface>(
      TYPES.JobService
    );
    const jobCreated = await jobService.createJob({
      jobData: createJobInputDto,
    });

    expect(jobCreated).toBe(jobReturnedFromRepo);
  });
});
