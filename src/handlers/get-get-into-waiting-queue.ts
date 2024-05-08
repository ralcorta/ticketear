import { v4 as uuid } from "uuid";
import { APIGatewayProxyEvent } from "aws-lambda";
import { QUEUES } from "../constants";
import { redisClient } from "../helpers/redis-client";
import { sendMessage } from "../helpers/sqs-client";
import { buildResponse } from "../helpers/build-response";
import { errorResponse } from "../helpers/error-response";

export const handler = async (event: APIGatewayProxyEvent) => {
  if (event.httpMethod !== "GET")
    return errorResponse(
      new Error(
        `getMethod only accept GET method, you tried: ${event.httpMethod}`
      ),
      event.requestContext.requestId
    );

  const token = uuid();
  await redisClient.zadd(QUEUES.WAITING, new Date().getTime(), token);
  const sqsResult = await sendMessage(token);
  return buildResponse(200, { token, sqsResult });
};
