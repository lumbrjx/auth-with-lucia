import { Redis } from "ioredis";

const redisClient = new Redis({
  host: process.env.REDIS_HOST,
  port: parseInt(process.env.REDIS_PORT ?? ""),
  password: process.env.REDIS_PASSWORD,
});

export default redisClient;
