import { APIGatewayProxyEvent } from "aws-lambda";
import { QUEUES } from "../constants";
import { buildResponse } from "../helpers/build-response";
import { redisClient } from "../helpers/redis-client";
import { errorResponse } from "../helpers/error-response";

export const handler = async (event: APIGatewayProxyEvent) => {
  if (event.httpMethod !== "GET")
    return errorResponse(
      new Error(
        `getMethod only accept GET method, you tried: ${event.httpMethod}`
      ),
      event.requestContext.requestId
    );
  if (!event.pathParameters?.uuid)
    return errorResponse(
      new Error(`Token UUID not provided in the path.`),
      event.requestContext.requestId
    );

  console.info("received:", event.pathParameters);

  const { uuid } = event.pathParameters;
  const positionOnWaitingQueue = await redisClient.zrank(QUEUES.WAITING, uuid);
  const positionOnInProgressQueue = await redisClient.zrank(
    QUEUES.IN_PROCESS,
    uuid
  );

  return buildResponse(200, {
    positionOnWaitingQueue,
    positionOnInProgressQueue,
  });
};
