import { OPERATION } from "../constants";

// Load the AWS SDK and ioredis
import Redis from "ioredis";

const redis = new Redis({
  host: process.env.REDIS_URL,
  port: parseInt(process.env.REDIS_PORT ?? ""),
});

exports.handler = async (event: any) => {
  console.log(`REDIS HANDLER! Received event: ${JSON.stringify(event)}`);
  const {
    operation,
    payload: { key, value, list },
  } = event;
  let res: any = null;

  switch (operation) {
    case OPERATION.CREATE:
      await redis.set(key, value);
      console.log(`Successfully set ${key} to ${value}`);
      break;
    case OPERATION.READ:
      res = await redis.get(key);
      console.log(`Value of ${key} is ${res}`);
      break;
    case OPERATION.UPDATE:
      await redis.set(key, value);
      console.log(`Successfully updated ${key} to ${value}`);
      break;
    case OPERATION.DELETE:
      await redis.del(key);
      console.log(`Successfully deleted ${key}`);
      break;
    case OPERATION.ZADD:
      res = await redis.zadd(list, value, key);
      console.log(`Successfully zadd ${res}`);
      break;
    default:
      console.log(`Invalid operation: ${operation}`);
      throw new Error(`Invalid operation: ${operation}`);
  }

  return res;
};
