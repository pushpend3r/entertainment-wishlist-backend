import assert from "assert";

const envs = ["TMDB_API_KEY", "JWT_SECRET_KEY", "MONGO_URI"];

export function validateEnv() {
  const notFoundEnvs = [];

  envs.forEach((env) => {
    if (!(env in process.env)) {
      notFoundEnvs.push(env);
    }
  });

  if (notFoundEnvs.length) {
    console.error("Following envs not defined");
    console.log(notFoundEnvs.join("\n"));
    process.exit(1);
  }
}
