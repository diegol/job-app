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
} from "../../common/index";

import { eventSchema } from "../schemas/update-note-input-schema";
import { NoteService } from "../note.service";

const tracer = new Tracer({ serviceName: "Update Notes" });

export class UpdateNote implements LambdaInterface {
  //for AWS X-ray
  @tracer.captureMethod()
  public async handler(_event: any, _context: any): Promise<any> {
    const statusCode = (await container
      .get<NoteService>(TYPES.NoteService)
      .updateNote(
        _event.pathParameters.jobId,
        _event.pathParameters.noteId,
        _event.body
      ))
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
      dimensions: [{ Action: "UpdateNotes" }],
    })
  )

  .handler(new UpdateNote().handler);
export { handler };
