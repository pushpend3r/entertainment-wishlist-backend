import TMDB from "../data-sources/tmdb";

export interface ApolloContext {
  dataSources: {
    tmdb: TMDB;
  };
  user: any;
}
