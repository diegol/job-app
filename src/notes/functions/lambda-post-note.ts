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
} from "../../ common/index";

import { eventSchema } from "../schemas/create-note-input-schema";
import { NoteService } from "../note.service";

const tracer = new Tracer({ serviceName: "Note Creation" });

export class CreateJob implements LambdaInterface {
  //for AWS X-ray
  @tracer.captureMethod()
  public async handler(_event: any, _context: any): Promise<any> {
    const note = await container
      .get<NoteService>(TYPES.NoteService)
      .createNote(_event.pathParameters.jobId, _event.body);
    if (note === null) {
      return {
        statusCode: 412,
      };
    }
    tracer.putAnnotation("successfulNoteCreating", true);

    return {
      statusCode: 201,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(note),
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
      dimensions: [{ Action: "CreateNotes" }],
    })
  )
  .use(captureLambdaHandler(tracer))
  .handler(new CreateJob().handler);
export { handler };
