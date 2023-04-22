import { getDataFromTMDBApi } from "../utils/getDataFromTMDBApi.js";
import { getAllGenres } from "../logic/index.js";

async function getTrendingStuff(req, res) {
  const mediaType = req.params.mediaType || "all";
  const timeWindow = req.params.timeWindow || "week";
  const genres = await getAllGenres();

  try {
    let { results } = await getDataFromTMDBApi(
      `/trending/${mediaType}/${timeWindow}`
    );

    results = results.map(item => {
      return {
        id: item.id,
        name: item.media_type === "movie" ? item.title : item.name,
        mediaType: item.media_type,
        year: new Date(item.release_date || item.first_air_date).getFullYear(),
        genres: item.genre_ids.map(
          id => genres[item.media_type].find(genre => genre.id === id).name
        ),
        posterUrl: `https://image.tmdb.org/t/p/w500${item.poster_path}`,
      };
    });

    return res.json(results);
  } catch (e) {
    console.error(e);
    return res.status(401).json({
      message: "Error while fetching data from TMDB API",
    });
  }
}

async function search(req, res) {}

async function getDetails(req, res) {}

export { getTrendingStuff, search, getDetails };
