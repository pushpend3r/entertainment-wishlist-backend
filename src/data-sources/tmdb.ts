import { RESTDataSource } from "@apollo/datasource-rest";

type BACKDROP_SIZES = "w300" | "w780" | "w1280" | "original";
type PROFILE_SIZES = "w45" | "w185" | "h632" | "original";
type POSTER_SIZES =
  | "w92"
  | "w154"
  | "w185"
  | "w342"
  | "w500"
  | "w780"
  | "original";

type IMAGE_SIZES = PROFILE_SIZES | POSTER_SIZES | BACKDROP_SIZES;

// https://www.apollographql.com/docs/apollo-server/data/fetching-rest/
class TMDB extends RESTDataSource {
  override baseURL = "https://api.themoviedb.org/3";
  public imageBaseURL = "https://image.tmdb.org/t/p";
  private apiKey = process.env.TMDB_API_KEY;

  getImageUrl = (imagePath: string, size: IMAGE_SIZES) => {
    return `${this.imageBaseURL}/${size}${imagePath}`;
  };

  getTVShowGenres = async () => {
    const response = await this.get(
      `${this.baseURL}/genre/tv/list?api_key=${this.apiKey}`
    );
    return response.genres;
  };

  getMovieGenres = async () => {
    const response = await this.get(
      `${this.baseURL}/genre/movie/list?api_key=${this.apiKey}`
    );
    return response.genres;
  };

  getMovie = async (id: number) => {
    const response = await this.get(
      `${this.baseURL}/movie/${id}?api_key=${this.apiKey}`
    );
    return response;
  };

  getTVShow = async (id: number) => {
    const response = await this.get(
      `${this.baseURL}/tv/${id}?api_key=${this.apiKey}`
    );
    return response;
  };

  getTrendingTVShows = async () => {
    const response = await this.get(
      `${this.baseURL}/trending/tv/week?&api_key=${this.apiKey}`
    );
    return response;
  };

  getTrendingMovies = async () => {
    const response = await this.get(
      `${this.baseURL}/trending/movie/week?&api_key=${this.apiKey}`
    );
    return response;
  };

  getMovieCredits = async (id: number) => {
    const response = await this.get(
      `${this.baseURL}/movie/${id}/credits?api_key=${this.apiKey}`
    );
    return response;
  };

  getTVShowCredits = async (id: number) => {
    const response = await this.get(
      `${this.baseURL}/tv/${id}/aggregate_credits?api_key=${this.apiKey}`
    );
    return response;
  };

  getMovieVideos = async (id: number) => {
    const response = await this.get(
      `${this.baseURL}/movie/${id}/videos?api_key=${this.apiKey}`
    );
    return response;
  };

  getTVShowVideos = async (id: number, season: number) => {
    const response = await this.get(
      `${this.baseURL}/tv/${id}/season/${season}/videos?api_key=${this.apiKey}`
    );
    return response;
  };
}

export default TMDB;
