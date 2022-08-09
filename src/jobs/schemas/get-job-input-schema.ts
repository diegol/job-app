export const eventSchema = {
  type: "object",
  properties: {
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
