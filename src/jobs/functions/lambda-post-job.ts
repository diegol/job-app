import "reflect-metadata";

import {
  middy,
  validator,
  httpErrorHandler,
  jsonBodyParser,
  cloudwatchMetrics,
  Tracer,
  captureLambdaHandler,
  LambdaInterface,
  container,
  TYPES,
  containerMiddleware,
  loggerMiddleware,
} from "../../common/functionCommon";

import { eventSchema } from "../schemas/create-job-input-schema";
import { JobService } from "../job.service";

const tracer = new Tracer({ serviceName: "CreateJob" });

export class CreateJob implements LambdaInterface {
  //for AWS X-ray
  @tracer.captureMethod()
  public async handler(_event: any, _context: any): Promise<any> {
    const job = await container
      .get<JobService>(TYPES.JobService)
      .createJob({ jobData: _event.body });

    tracer.putAnnotation("successfulJobCreating", true);

    return {
      statusCode: 201,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(job),
    };
  }
}

const handler = middy()
  .use(jsonBodyParser()) // parses the request body when it's a JSON and converts it to an object
  .use(validator({ eventSchema })) // validates the input
  .use(containerMiddleware())
  .use(loggerMiddleware())
  .use(
    cloudwatchMetrics({
      namespace: "JobApp",
      dimensions: [{ Action: "CreateJobs" }],
    })
  )
  .use(httpErrorHandler()) // handles common http errors and returns proper responses
  .use(captureLambdaHandler(tracer))
  .handler(new CreateJob().handler);
export { handler };
