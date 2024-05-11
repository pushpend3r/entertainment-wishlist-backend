import { ApolloServer } from "@apollo/server";
import {
  StandaloneServerContextFunctionArgument as ContextArgs,
  startStandaloneServer,
} from "@apollo/server/standalone";
import { GraphQLError } from "graphql";

import { TokenType, getTokenPayload, verifyToken } from "./utils/auth";
import { User } from "./db/models/user";
import TMDB from "./data-sources/tmdb";
import { ApolloContext } from "./types/apollo";
import { resolvers, typeDefs } from "./graphql";

const PORT = +process.env.PORT || 4000;

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

const { url } = await startStandaloneServer(server, {
  listen: { port: PORT },
  context: async ({ req }: ContextArgs): Promise<ApolloContext> => {
    const authToken = (req.headers["authorization"] || "")
      .replace("Bearer ", "")
      .trim();

    let user = null;

    if (authToken) {
      let payload: any = null;
      try {
        verifyToken(authToken);
        payload = getTokenPayload(authToken) as any;
        if (payload.tokenType === TokenType.REFRESH) {
          throw new Error();
        }
      } catch (error) {
        throw new GraphQLError("User is not authenticated", {
          extensions: {
            code: "UNAUTHENTICATED",
            http: { status: 401 },
          },
        });
      }
      user = await User.findById(payload.id);
    }

    const { cache } = server;
    return {
      dataSources: {
        tmdb: new TMDB({ cache }),
      },
      user,
    };
  },
});

console.log(`🚀 Server ready at: ${url}`);
