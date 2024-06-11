import { Redis } from "ioredis";

const redisConfig = {
  host: process.env.REDIS_URL || "host.docker.internal",
  port: process.env.REDIS_PORT ? parseInt(process.env.REDIS_PORT) : 4510,
};
const redisClient = new Redis(redisConfig);

export { redisClient };
