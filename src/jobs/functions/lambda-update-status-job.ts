import "reflect-metadata";

import {
  middy,
  validator,
  httpErrorHandler,
  jsonBodyParser,
  cloudwatchMetrics,
  LambdaInterface,
  container,
  TYPES,
  Tracer,
} from "../../ common/index";

import { eventSchema } from "../schemas/update-status-job-schema";
import { JobService } from "../job.service";

const tracer = new Tracer({ serviceName: "UpdateJob" });
export class UpdateStatusJob implements LambdaInterface {
  //for AWS X-ray
  @tracer.captureMethod()
  public async handler(_event: any, _context: any): Promise<any> {
    const statusCode = (await container
      .get<JobService>(TYPES.JobService)
      .updateJobStatus(_event.body, _event.pathParameters.jobId))
      ? 204
      : 404;

    return {
      statusCode: statusCode,
    };
  }
}

const handler = middy()
  .use(jsonBodyParser()) // parses the request body when it's a JSON and converts it to an object
  .use(validator({ eventSchema })) // validates the input
  .use(httpErrorHandler()) // handles common http errors and returns proper responses
  .use(
    cloudwatchMetrics({
      namespace: "JobApp",
      dimensions: [{ Action: "CreateJobs" }],
    })
  )

  .handler(new UpdateStatusJob().handler);
export { handler };