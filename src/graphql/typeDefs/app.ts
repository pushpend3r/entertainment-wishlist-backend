export default /* GraphQL */ `
  type Mutation {
    addMovieToWishlist(movieId: Int): Boolean
    removeMovieFromWishlist(movieId: Int): Boolean

    addTVShowToWishlist(tvshowId: Int): Boolean
    removeTVShowFromWishlist(tvshowId: Int): Boolean

    addMovieToWatchedlist(movieId: Int): Boolean
    removeMovieFromWatchedlist(movieId: Int): Boolean

    addTVShowToWatchedlist(tvshowId: Int): Boolean
    removeTVShowFromWatchedlist(tvshowId: Int): Boolean
  }
`;
