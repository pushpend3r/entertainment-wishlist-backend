import { getDataFromTMDBApi } from "../utils/getDataFromTMDBApi.js";

let allGenres = null;

async function getAllGenres() {
  if (allGenres === null) {
    allGenres = {
      tv: (await getDataFromTMDBApi("/genre/tv/list")).genres,
      movie: (await getDataFromTMDBApi("/genre/movie/list")).genres,
    };
  }
  return allGenres;
}

async function getTrailerLink(id, mediaType) {
  const { results } = await getDataFromTMDBApi(`/${mediaType}/${id}/videos`);
  return `https://www.youtube.com/watch?v=${
    results.find(
      item => item.site === "YouTube" && item.name === "Official Trailer"
    ).key
  }`;
}

async function getPeopleNames(id, mediaType) {
  const { cast, crew } = await getDataFromTMDBApi(
    `/${mediaType}/${id}/credits`
  );

  return {
    directors: crew
      .filter(
        item =>
          item.job === "Director" || item.known_for_department === "Directing"
      )
      .map(item => ({
        id: item.id,
        name: item.name,
      })),

    cast: cast.map(item => ({
      id: item.id,
      name: item.name,
    })),

    writers: crew
      .filter(item => item.job === "Writer" || item.department === "Writing")
      .map(item => ({
        id: item.id,
        name: item.name,
      })),
  };
}

async function getDetails(
  id,
  mediaType,
  user = {
    isInAlreadyWatchedList: false,
    isInWannaWatchList: false,
  }
) {
  const data = await getDataFromTMDBApi(`/${mediaType}/${id}`);
  const { directors, writers, cast } = await getPeopleNames(id, mediaType);
  const trailerLink = await getTrailerLink(id, mediaType);

  return {
    id: data.id,
    name: mediaType === "movie" ? data.title : data.name,
    mediaType: mediaType,
    year: new Date(data.release_date || data.first_air_date).getFullYear(),
    genres: data.genres.map(item => item.name),
    overview: data.overview,
    posterUrl: `https://image.tmdb.org/t/p/w500${data.poster_path}`,
    backdropPath: `https://image.tmdb.org/t/p/w1280${data.backdrop_path}`,
    directors,
    cast,
    writers,
    trailerLink,
    isInWannaWatchList,
    isInAlreadyWatchedList,
  };
}

export { getDetails, getAllGenres };
