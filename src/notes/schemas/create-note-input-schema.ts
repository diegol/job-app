export const eventSchema = {
  type: "object",
  properties: {
    body: {
      type: "object",
      properties: {
        description: {
          type: "string",
          minLength: 4,
          maxLength: 2000,
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
      },
      required: ["jobId"],
    },
  },
};
