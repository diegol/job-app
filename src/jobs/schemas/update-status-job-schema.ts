export const eventSchema = {
  type: "object",
  properties: {
    body: {
      type: "object",
      properties: {
        status: {
          type: "string",
          pattern: "^(scheduled|active|invoicing|to priced|completed)$",
        },
      },
      required: ["status"],
    },
    pathParameters: {
      type: "object",
      properties: {
        jobId: {
          type: "string",
          format: "uuid",
        },
      },
      required: ["jobId"],
    },
  },
};
