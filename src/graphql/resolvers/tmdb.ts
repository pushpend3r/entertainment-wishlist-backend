import { GraphQLError } from "graphql";
import { ApolloContext } from "../../types/apollo";
import { Wishlist } from "../../db/models/wishlist";
import { WatchedList } from "../../db/models/watchedlist";
import { UserNotAuthenticated } from "../../utils/apollo";

export default {
  Person: {
    imageUrl: (person, _, context: ApolloContext) => {
      return context.dataSources.tmdb.getImageUrl(person.profile_path, "w185");
    },
    character: (person) => {
      if (person?.character) return person?.character;

      const roles = person?.roles?.sort(
        (a, b) => b.episode_count - a.episode_count
      );

      return roles?.[0]?.character;
    },
  },
  Movie: {
    name: (movie) => movie.title,
    backdropUrl: (movie, _, context: ApolloContext) => {
      return context.dataSources.tmdb.getImageUrl(movie.backdrop_path, "w1280");
    },
    posterUrl: (movie, _, context: ApolloContext) => {
      return context.dataSources.tmdb.getImageUrl(movie.poster_path, "w500");
    },
    actor: async (movie, _, context: ApolloContext) => {
      const credits = await context.dataSources.tmdb.getMovieCredits(movie.id);
      return credits?.cast?.filter(
        (cast) => cast.known_for_department === "Acting"
      );
    },
    genres: async (movie, args, context: ApolloContext, info) => {
      if (movie.genres) {
        return movie.genres;
      }

      if (movie.genre_ids) {
        const genres = await context.dataSources.tmdb.getMovieGenres();
        return genres.filter((genre) => movie.genre_ids.includes(genre.id));
      }

      return null;
    },
    releaseDate: (movie) => movie.release_date,
    director: async (movie, _, context: ApolloContext) => {
      const credits = await context.dataSources.tmdb.getMovieCredits(movie.id);
      return credits?.crew?.filter((cast) => cast.job === "Director");
    },
    writer: async (movie, _, context: ApolloContext) => {
      const credits = await context.dataSources.tmdb.getMovieCredits(movie.id);
      return credits?.crew?.filter((cast) => cast.job === "Writer");
    },
    trailerLink: async (movie, _, context: ApolloContext) => {
      const data = await context.dataSources.tmdb.getMovieVideos(movie.id);
      const trailer = data?.results?.find(
        (video) => video.site === "YouTube" && video.type === "Trailer"
      );

      if (!trailer) return null;

      return `https://www.youtube.com/watch?v=${trailer.key}`;
    },
    isWatched: async (movie, _, context: ApolloContext) => {
      const movieId = movie.id;
      const { user } = context || {};
      if (!user) {
        return false;
      }
      const userWithWatchedlist = await user.populate("watchedlist");
      return userWithWatchedlist?.watchedlist?.media?.movie_ids?.includes(
        movieId
      );
    },
    isWishlisted: async (movie, _, context: ApolloContext) => {
      const movieId = movie.id;
      const { user } = context || {};
      if (!user) {
        return false;
      }
      const userWithWishlist = await user.populate("wishlist");
      return userWithWishlist?.wishlist?.media?.movie_ids?.includes(movieId);
    },
  },
  TVShow: {
    inProduction: (tvshow) => tvshow.in_production,
    backdropUrl: (tvshow, _, context: ApolloContext) => {
      return context.dataSources.tmdb.getImageUrl(
        tvshow.backdrop_path,
        "w1280"
      );
    },
    posterUrl: (tvshow, _, context: ApolloContext) => {
      return context.dataSources.tmdb.getImageUrl(tvshow.poster_path, "w500");
    },
    startAirDate: (tvshow) => tvshow.first_air_date,
    lastAirDate: (tvshow) => tvshow.last_air_date,
    genres: async (tvshow, args, context, info) => {
      if (tvshow.genres) {
        return tvshow.genres;
      }

      if (tvshow.genre_ids) {
        const genres = await context.dataSources.tmdb.getTVShowGenres();
        return genres.filter((genre) => tvshow.genre_ids.includes(genre.id));
      }

      return null;
    },
    actor: async (tvshow, _, context: ApolloContext) => {
      const credits = await context.dataSources.tmdb.getTVShowCredits(
        tvshow.id
      );
      return credits?.cast?.filter(
        (cast) => cast.known_for_department === "Acting"
      );
    },
    director: async (tvshow, _, context: ApolloContext) => {
      const credits = await context.dataSources.tmdb.getTVShowCredits(
        tvshow.id
      );
      return credits?.crew?.filter(
        (cast) =>
          cast.known_for_department === "Directing" &&
          cast.department === "Directing"
      );
    },
    writer: async (tvshow, _, context: ApolloContext) => {
      const credits = await context.dataSources.tmdb.getTVShowCredits(
        tvshow.id
      );
      return credits?.crew?.filter(
        (cast) =>
          cast.known_for_department === "Writing" &&
          cast.department === "Writing"
      );
    },
    seasons: (tvshow) => tvshow.number_of_seasons,
    trailerLink: async (tvshow, _, context: ApolloContext) => {
      const data = await context.dataSources.tmdb.getTVShowVideos(
        tvshow.id,
        tvshow.number_of_seasons
      );
      const trailer = data?.results?.find(
        (video) => video.site === "YouTube" && video.type === "Trailer"
      );

      if (!trailer) return null;

      return `https://www.youtube.com/watch?v=${trailer.key}`;
    },
    isWatched: async (tvshow, _, context: ApolloContext) => {
      const tvshowId = tvshow.id;
      const { user } = context || {};
      if (!user) {
        return false;
      }
      const userWithWatchedlist = await user.populate("watchedlist");
      return userWithWatchedlist?.watchedlist?.media?.tvshow_ids?.includes(
        tvshowId
      );
    },
    isWishlisted: async (tvshow, _, context: ApolloContext) => {
      const tvshowId = tvshow.id;
      const { user } = context || {};
      if (!user) {
        return false;
      }
      const userWithWishlist = await user.populate("wishlist");
      return userWithWishlist?.wishlist?.media?.tvshow_ids?.includes(tvshowId);
    },
  },
  Query: {
    async getMovie(_, args, context: ApolloContext) {
      const id = args.id;
      const data = await context.dataSources.tmdb.getMovie(id);
      return data;
    },
    async getWatchedMovies(_, args, context: ApolloContext) {
      const { user } = context || {};
      if (!user) {
        throw new UserNotAuthenticated();
      }
      const watchedList = await WatchedList.findOne({
        user: user.id,
      });

      const result = watchedList?.media?.movie_ids?.map((id) =>
        context.dataSources.tmdb.getMovie(id)
      );

      return result;
    },
    async getWishlistedMovies(_, args, context: ApolloContext) {
      const { user } = context || {};
      if (!user) {
        throw new UserNotAuthenticated();
      }
      const wishlist = await Wishlist.findOne({
        user: user.id,
      });

      const result = wishlist?.media?.movie_ids?.map((id) =>
        context.dataSources.tmdb.getMovie(id)
      );

      return result;
    },

    async getTVShow(_, args, context: ApolloContext) {
      const id = args.id;
      const data = await context.dataSources.tmdb.getTVShow(id);
      return data;
    },
    async getWatchedTVShows(_, args, context: ApolloContext) {
      const { user } = context || {};
      if (!user) {
        throw new UserNotAuthenticated();
      }

      const watchedList = await WatchedList.findOne({
        user: user.id,
      });

      const result = watchedList?.media?.tvshow_ids?.map((id) =>
        context.dataSources.tmdb.getTVShow(id)
      );

      return result;
    },
    async getWishlistedTVShows(_, args, context: ApolloContext) {
      const { user } = context || {};
      if (!user) {
        throw new UserNotAuthenticated();
      }

      const wishlist = await Wishlist.findOne({
        user: user.id,
      });

      const result = wishlist?.media?.tvshow_ids?.map((id) =>
        context.dataSources.tmdb.getTVShow(id)
      );

      return result;
    },

    async trending(parent, args, context: ApolloContext, info) {
      const { results: tvshows } =
        await context.dataSources.tmdb.getTrendingTVShows();
      const { results: movies } =
        await context.dataSources.tmdb.getTrendingMovies();
      return {
        tvshows,
        movies,
      };
    },
  },
};
