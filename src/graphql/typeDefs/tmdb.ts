export default /* GraphQL */ `
  type Person {
    id: Int!
    name: String
    character: String
    imageUrl: String
  }

  type Genre {
    id: Int!
    name: String
  }

  type Movie {
    id: Int!
    name: String
    overview: String

    genres: [Genre!]

    backdropUrl: String
    posterUrl: String

    actor: [Person!]
    director: [Person!]
    writer: [Person!]

    trailerLink: String

    releaseDate: String

    isWatched: Boolean
    isWishlisted: Boolean
  }

  type TVShow {
    id: Int!
    name: String
    overview: String

    genres: [Genre!]

    backdropUrl: String
    posterUrl: String

    actor: [Person!]
    director: [Person!]
    writer: [Person!]

    inProduction: Boolean

    trailerLink: String

    startAirDate: String
    lastAirDate: String

    seasons: Int

    isWatched: Boolean
    isWishlisted: Boolean
  }

  type Trending {
    movies: [Movie]
    tvshows: [TVShow]
  }

  type Query {
    trending: Trending

    getMovie(id: Int): Movie

    getTVShow(id: Int): TVShow

    getWatchedMovies: [Movie]
    getWishlistedMovies: [Movie]

    getWatchedTVShows: [TVShow]
    getWishlistedTVShows: [TVShow]
  }
`;
