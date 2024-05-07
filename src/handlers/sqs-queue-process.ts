import { SQSEvent, SQSHandler } from "aws-lambda";
import { redisClient } from "../helpers/redis-client";
import { QUEUES } from "../constants";
import { timer } from "../helpers/timer";

export const handler: SQSHandler = async (event: SQSEvent) => {
  console.log("[!!!!!!] Received event:", event);
  await timer(2);

  for (const message of event.Records) {
    const uuid = message.body;
    try {
      await redisClient.zadd(QUEUES.IN_PROCESS, new Date().getTime(), uuid);
      await redisClient.zrem(QUEUES.WAITING, uuid);
      console.log(`Processed message ${message.body}`);
    } catch (err) {
      console.error("An error occurred");
      throw err;
    }
  }

  return;
};
