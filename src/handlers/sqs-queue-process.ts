import { SQSEvent, SQSHandler } from "aws-lambda";
import { redisClient } from "../helpers/redis-client";
import { QUEUES } from "../constants";

const LIMIT_OF_PAYMENT = 5;
// const EXPIRATION_TIME = 30;

export const handler: SQSHandler = async (event: SQSEvent) => {
  for (const message of event.Records) {
    const { stage, uuid } = JSON.parse(message.body);
    if (stage == QUEUES.WAITING) {
      // CHECK IN PROCESS QUEUE TO ADD TO IN PROCESS QUEUE
      const inProcessQueue = (await redisClient.keys("*")).filter(
        (key) => key !== QUEUES.WAITING
      );
      if (inProcessQueue.length <= LIMIT_OF_PAYMENT) {
        await redisClient.set(
          uuid,
          new Date().getTime()
          // "EX",
          // EXPIRATION_TIME
        );
        await redisClient.zrem(QUEUES.WAITING, uuid);
      }
    } else if (stage == QUEUES.IN_PROCESS) {
      // USER PAID AND NEED TO REMOVE FROM IN PROCESS QUEUE AND ADD TO PROCESSED QUEUE
      await redisClient.del(uuid);
      const [nextIntoTheProcessQueue] = await redisClient.zrevrange(
        QUEUES.WAITING,
        0,
        0
      );
      if (nextIntoTheProcessQueue) {
        await redisClient.zrem(QUEUES.WAITING, nextIntoTheProcessQueue);
        await redisClient.set(
          nextIntoTheProcessQueue,
          new Date().getTime()
          // "EX",
          // EXPIRATION_TIME
        );
      }
    }
    console.log(`Processed message ${message.body}`);
  }
  return;
};
