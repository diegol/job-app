export const eventSchema = {
  type: "object",
  properties: {
    body: {
      type: "object",
      properties: {
        description: {
          type: "string",
        },
      },
      required: ["description"],
    },
    pathParameters: {
      type: "object",
      properties: {
        jobId: {
          type: "string",
          format: "uuid",
        },
        noteId: {
          type: "string",
          format: "uuid",
        },
      },
      required: ["noteId"],
    },
  },
};
