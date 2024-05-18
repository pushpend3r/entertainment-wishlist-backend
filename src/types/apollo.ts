import { createClient } from "redis";
import TMDB from "../data-sources/tmdb";

export interface ApolloContext {
  dataSources: {
    tmdb: TMDB;
    redisClient: ReturnType<typeof createClient>;
  };
  user: any;
}
