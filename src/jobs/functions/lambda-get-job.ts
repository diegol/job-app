import {
  middy,
  validator,
  httpErrorHandler,
  cloudwatchMetrics,
  jsonBodyParser,
  LambdaInterface,
  container,
  TYPES,
  Tracer,
} from "../../ common/index";

import { JobRepositoryInterface, JobServiceInterface } from "../../interfaces";
import { eventSchema } from "../schemas/get-job-input-schema";

const tracer = new Tracer({ serviceName: "GetJobs" });
export class GetJob implements LambdaInterface {
  //for AWS X-ray
  @tracer.captureMethod()
  public async handler(_event: any, _context: any): Promise<any> {
    const job = await container
      .get<JobRepositoryInterface>(TYPES.JobRepository)
      .findByJobId(_event.pathParameters.jobId);

    if (job === null) {
      return {
        statusCode: 404,
      };
    }

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(job),
    };
  }
}

const handler = middy()
  .use(jsonBodyParser()) // parses the request body when it's a JSON and converts it to an object
  .use(validator({ inputSchema: eventSchema })) // validates the input
  .use(
    cloudwatchMetrics({
      namespace: "JobApp",
      dimensions: [{ Action: "GetJobs" }],
    })
  )
  .use(httpErrorHandler()) // handles common http errors and returns proper responses
  .handler(new GetJob().handler);
export { handler };
