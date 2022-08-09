//import "reflect-metadata";

import {
  middy,
  validator,
  httpErrorHandler,
  jsonBodyParser,
  LambdaInterface,
  cloudwatchMetrics,
  container,
  TYPES,
  Tracer,
} from "../../ common/index";

import { eventSchema } from "../schemas/list-note-input-schema";
import { NoteRepository } from "../../repositories/note.repository";

const tracer = new Tracer({ serviceName: "Get Note" });
export class ListJobs implements LambdaInterface {
  //for AWS X-ray
  @tracer.captureMethod()
  public async handler(_event: any, _context: any): Promise<any> {
    //[TODO] ideally this should go to the service class
    const results = await container
      .get<NoteRepository>(TYPES.NoteRepository)
      .findList(_event.pathParameters.jobId);

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
  .use(
    cloudwatchMetrics({
      namespace: "JobApp",
      dimensions: [{ Action: "ListNotes" }],
    })
  )
  .use(httpErrorHandler()) // handles common http errors and returns proper responses
  .handler(new ListJobs().handler);
export { handler };
