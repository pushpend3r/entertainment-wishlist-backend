import fetch from "node-fetch";

async function getDataFromTMDBApi(url, queryString = {}) {
  const _url = new URL(process.env.TMDB_BASE_URL + url);

  // add the API key
  _url.searchParams.set("api_key", process.env.TMDB_API_KEY);

  // add other query params if provided
  for (const key in queryString) _url.searchParams.set(key, queryString[key]);

  const response = await fetch(_url.href);

  const json = await response.json();

  return json;
}

export { getDataFromTMDBApi };
