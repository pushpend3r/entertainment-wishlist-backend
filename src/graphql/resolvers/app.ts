import { ApolloContext } from "../../types/apollo";
import { Wishlist } from "../../db/models/wishlist";
import { WatchedList } from "../../db/models/watchedlist";
import { BadRequest, UserNotAuthenticated } from "../../utils/apollo";

export default {
  Mutation: {
    addMovieToWishlist: async (parent, args, context: ApolloContext, info) => {
      const { user } = context || {};
      const { movieId } = args || {};

      if (!user) {
        throw new UserNotAuthenticated();
      }

      if (!movieId) {
        throw new BadRequest("Please provide movie id");
      }

      await Wishlist.findOneAndUpdate(
        {
          user: user._id,
        },
        {
          $push: {
            "media.movie_ids": movieId,
          },
        },
        {
          upsert: true,
        }
      );

      await WatchedList.findOneAndUpdate(
        {
          user: user._id,
        },
        {
          $pull: {
            "media.movie_ids": movieId,
          },
        }
      );

      return true;
    },
    removeMovieFromWishlist: async (
      parent,
      args,
      context: ApolloContext,
      info
    ) => {
      const { user } = context || {};
      const { movieId } = args || {};

      if (!user) {
        throw new UserNotAuthenticated();
      }

      if (!movieId) {
        throw new BadRequest("Please provide movie id");
      }

      await Wishlist.findOneAndUpdate(
        {
          user: user._id,
        },
        {
          $pull: {
            "media.movie_ids": movieId,
          },
        }
      );

      return true;
    },

    addMovieToWatchedlist: async (
      parent,
      args,
      context: ApolloContext,
      info
    ) => {
      const { user } = context || {};
      const { movieId } = args || {};

      if (!user) {
        throw new UserNotAuthenticated();
      }

      if (!movieId) {
        throw new BadRequest("Please provide movie id");
      }

      await WatchedList.findOneAndUpdate(
        {
          user: user._id,
        },
        {
          $push: {
            "media.movie_ids": movieId,
          },
        },
        {
          upsert: true,
        }
      );

      await Wishlist.findOneAndUpdate(
        {
          user: user._id,
        },
        {
          $pull: {
            "media.movie_ids": movieId,
          },
        }
      );

      return true;
    },
    removeMovieFromWatchedlist: async (
      parent,
      args,
      context: ApolloContext,
      info
    ) => {
      const { user } = context || {};
      const { movieId } = args || {};

      if (!user) {
        throw new UserNotAuthenticated();
      }

      if (!movieId) {
        throw new BadRequest("Please provide movie id");
      }

      await WatchedList.findOneAndUpdate(
        {
          user: user._id,
        },
        {
          $pull: {
            "media.movie_ids": movieId,
          },
        }
      );

      return true;
    },

    addTVShowToWishlist: async (parent, args, context: ApolloContext, info) => {
      const { user } = context || {};
      const { tvshowId } = args || {};

      if (!user) {
        throw new UserNotAuthenticated();
      }

      if (!tvshowId) {
        throw new BadRequest("Please provide tvshow id");
      }

      await Wishlist.findOneAndUpdate(
        {
          user: user._id,
        },
        {
          $push: {
            "media.tvshow_ids": tvshowId,
          },
        },
        {
          upsert: true,
        }
      );

      await WatchedList.findOneAndUpdate(
        {
          user: user._id,
        },
        {
          $pull: {
            "media.tvshow_ids": tvshowId,
          },
        }
      );

      return true;
    },
    removeTVShowFromWishlist: async (
      parent,
      args,
      context: ApolloContext,
      info
    ) => {
      const { user } = context || {};
      const { tvshowId } = args || {};

      if (!user) {
        throw new UserNotAuthenticated();
      }

      if (!tvshowId) {
        throw new BadRequest("Please provide tvshow id");
      }

      await Wishlist.findOneAndUpdate(
        {
          user: user._id,
        },
        {
          $pull: {
            "media.tvshow_ids": tvshowId,
          },
        }
      );

      return true;
    },

    addTVShowToWatchedlist: async (
      parent,
      args,
      context: ApolloContext,
      info
    ) => {
      const { user } = context || {};
      const { tvshowId } = args || {};

      if (!user) {
        throw new UserNotAuthenticated();
      }

      if (!tvshowId) {
        throw new BadRequest("Please provide tvshow id");
      }

      await WatchedList.findOneAndUpdate(
        {
          user: user._id,
        },
        {
          $push: {
            "media.tvshow_ids": tvshowId,
          },
        },
        {
          upsert: true,
        }
      );

      await Wishlist.findOneAndUpdate(
        {
          user: user._id,
        },
        {
          $pull: {
            "media.tvshow_ids": tvshowId,
          },
        }
      );

      return true;
    },
    removeTVShowFromWatchedlist: async (
      parent,
      args,
      context: ApolloContext,
      info
    ) => {
      const { user } = context || {};
      const { tvshowId } = args || {};

      if (!user) {
        throw new UserNotAuthenticated();
      }

      if (!tvshowId) {
        throw new BadRequest("Please provide tvshow id");
      }

      await WatchedList.findOneAndUpdate(
        {
          user: user._id,
        },
        {
          $pull: {
            "media.tvshow_ids": tvshowId,
          },
        }
      );

      return true;
    },
  },
};
