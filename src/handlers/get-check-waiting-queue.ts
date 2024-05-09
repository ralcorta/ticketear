import { APIGatewayProxyEvent } from "aws-lambda";
import { QUEUES } from "../constants";
import { buildResponse } from "../helpers/build-response";
import { redisClient } from "../helpers/redis-client";
import { errorResponse } from "../helpers/error-response";

export const handler = async (event: APIGatewayProxyEvent) => {
  if (!event.pathParameters?.uuid)
    return errorResponse(
      new Error(`Token UUID not provided in the path.`),
      event.requestContext.requestId
    );

  console.info("received:", event.pathParameters);

  const { uuid } = event.pathParameters;
  const positionOnWaitingQueue = await redisClient.zrank(QUEUES.WAITING, uuid);
  const positionOnInProgressQueue = await redisClient.get(uuid);

  return buildResponse(200, {
    positionOnWaitingQueue,
    positionOnInProgressQueue,
  });
};
