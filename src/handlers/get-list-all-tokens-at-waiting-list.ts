import { APIGatewayProxyEvent } from "aws-lambda";
import { QUEUES } from "../constants";
import { redisClient } from "../helpers/redis-client";
import { buildResponse } from "../helpers/build-response";
import { errorResponse } from "../helpers/error-response";

export const handler = async (event: APIGatewayProxyEvent) => {
  if (event.httpMethod !== "GET") {
    return errorResponse(
      new Error(
        `getMethod only accept GET method, you tried: ${event.httpMethod}`
      ),
      event.requestContext.requestId
    );
  }
  console.log(process.env);
  const waitingQueueResult = await redisClient.zrange(QUEUES.WAITING, 0, 100);
  const inProcessQueueResult = await redisClient.zrange(
    QUEUES.IN_PROCESS,
    0,
    100
  );
  return buildResponse(200, { waitingQueueResult, inProcessQueueResult });
};
