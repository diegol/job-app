export const eventSchema = {
  type: "object",
  properties: {
    body: {
      type: "object",
      properties: {
        firstName: {
          type: "string",
          minLength: 4,
          maxLength: 20,
        },
        lastName: {
          type: "string",
          minLength: 4,
          maxLength: 20,
        },
        address: {
          type: "string",
          minLength: 4,
          maxLength: 20,
        },
        mobileNumber: {
          type: "string",
          minLength: 10,
          maxLength: 20,
          pattern: "^[0-9 -]+$",
        },
        email: {
          type: "string",
          minLength: 4,
          maxLength: 20,
          format: "email",
        },
      },
      required: ["firstName", "mobileNumber", "address", "email"],
    },
  },
};
