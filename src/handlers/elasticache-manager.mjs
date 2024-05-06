import { OperationEnum } from "../operations.mjs";

// Load the AWS SDK and ioredis
import Redis from "ioredis";

const redis = new Redis({
  host: process.env.REDIS_URL,
  port: process.env.REDIS_PORT,
});

exports.handler = async (event) => {
  const {
    operation,
    payload: { key, value, list },
  } = event;

  switch (operation) {
    case OperationEnum.CREATE:
      await redis.set(key, value);
      console.log(`Successfully set ${key} to ${value}`);
      return value;
    case OperationEnum.READ:
      const res = await redis.get(key);
      console.log(`Value of ${key} is ${res}`);
      return res;
    case OperationEnum.UPDATE:
      await redis.set(key, value);
      console.log(`Successfully updated ${key} to ${value}`);
      return value;
    case OperationEnum.DELETE:
      await redis.del(key);
      console.log(`Successfully deleted ${key}`);
      return null;
    case OperationEnum.ZADD:
      const resZadd = await redis.zadd(list, value, key);
      console.log(`Successfully zadd ${resZadd}`);
      return resZadd;
    default:
      const msj = `Invalid operation: ${operation}`;
      console.log(msj);
      throw new Error(msj);
  }
};
