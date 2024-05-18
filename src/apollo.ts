import { ApolloServer } from "@apollo/server";
import {
  StandaloneServerContextFunctionArgument as ContextArgs,
  startStandaloneServer,
} from "@apollo/server/standalone";

import { TokenType, getTokenPayload, verifyToken } from "./utils/auth";
import { User } from "./db/models/user";
import TMDB from "./data-sources/tmdb";
import { ApolloContext } from "./types/apollo";
import { resolvers, typeDefs } from "./graphql";
import { UserNotAuthenticated } from "./utils/apollo";
import redisClient from "./redis";
import { RedisKeys } from "./redis/keys";

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
        const isTokenBlackListed = await redisClient.SISMEMBER(
          RedisKeys.BLACKLISTED_TOKENS,
          payload.id
        );

        if (isTokenBlackListed) {
          throw new Error();
        }
      } catch (error) {
        throw new UserNotAuthenticated();
      }
      user = await User.findById(payload.userId || payload.id);
    }

    const { cache } = server;
    return {
      dataSources: {
        tmdb: new TMDB({ cache }),
        redisClient: redisClient,
      },
      user,
    };
  },
});

console.log(`\n🚀 Server ready at: ${url}\n`);
