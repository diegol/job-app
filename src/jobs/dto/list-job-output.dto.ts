import { Job } from "../../entity/Job";

export interface ListJobOutputDto {
  metadata: {
    totalRecordsCount: number;
    pageSize: number;
    offset: number;
  };
  jobs: Job[];
}
