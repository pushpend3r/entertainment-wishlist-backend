import { GraphQLError } from "graphql";

export class UserNotAuthenticated extends GraphQLError {
  constructor() {
    super("User is not authenticated", {
      extensions: {
        code: "UNAUTHENTICATED",
        http: { status: 401 },
      },
    });
  }
}

export class BadRequest extends GraphQLError {
  constructor(message) {
    super(message, {
      extensions: {
        code: "BAD_REQUEST",
        http: { status: 400 },
      },
    });
  }
}
