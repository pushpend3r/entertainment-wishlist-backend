import { createClient } from "redis";

const redisClient = createClient({
  url: process.env.REDIS_STACK_SERVER_URI,
  name: "entertainment-wishlist",
});

redisClient.on("error", (err) => {
  console.error("Error occured while connecting to redis", err);
});

console.info("Connecting to Redis...");

await redisClient.connect();

console.info("Connected with Redis");

export default redisClient;
