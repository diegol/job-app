//import "reflect-metadata";

import {
  middy,
  validator,
  cloudwatchMetrics,
  httpErrorHandler,
  jsonBodyParser,
  LambdaInterface,
  container,
  TYPES,
  Tracer,
  containerMiddleware,
  loggerMiddleware,
} from "../../common/functionCommon";

import { JobServiceInterface } from "../../interfaces";
import { eventSchema } from "../schemas/list-job-filter-schema";

const tracer = new Tracer({ serviceName: "ListJobs" });

export class ListJobs implements LambdaInterface {
  //for AWS X-ray
  @tracer.captureMethod()
  public async handler(_event: any, _context: any): Promise<any> {
    const results = await container
      .get<JobServiceInterface>(TYPES.JobService)
      .listJobs(_event.queryStringParameters);

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(results),
    };
  }
}

const handler = middy()
  .use(jsonBodyParser()) // parses the request body when it's a JSON and converts it to an object
  .use(validator({ inputSchema: eventSchema })) // validates the input
  .use(containerMiddleware())
  .use(loggerMiddleware())
  .use(
    cloudwatchMetrics({
      namespace: "JobApp",
      dimensions: [{ Action: "ListJobs" }],
    })
  )
  .use(httpErrorHandler()) // handles common http errors and returns proper responses
  .handler(new ListJobs().handler);
export { handler };
