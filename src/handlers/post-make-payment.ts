import { APIGatewayProxyEvent } from "aws-lambda";
import { QUEUES } from "../constants";
import { redisClient } from "../helpers/redis-client";
import { buildResponse } from "../helpers/build-response";
import { errorResponse } from "../helpers/error-response";
import { dynamodb } from "../helpers/dynamo-client";

const salesTableName = process.env.SALES_TABLE ?? "";

export const handler = async (event: APIGatewayProxyEvent) => {
  if (!event.pathParameters?.uuid)
    return errorResponse(
      new Error(`Token UUID not provided in the path.`),
      event.requestContext.requestId
    );

  const { uuid } = event.pathParameters;
  const exactStartingTime = await redisClient.zscore(QUEUES.IN_PROCESS, uuid);
  console.log({ exactStartingTime, uuid });

  if (!exactStartingTime)
    return errorResponse(
      new Error(`Token ${uuid} is not in the IN_PROCESS queue`),
      event.requestContext.requestId
    );

  let result: any;
  try {
    await dynamodb
      .put({
        TableName: salesTableName,
        Item: {
          id: uuid,
          initTime: exactStartingTime.toString(),
          email: event.queryStringParameters?.email
            ? event.queryStringParameters.email
            : "unknown",
        },
      })
      .promise();
    result = await dynamodb
      .get({
        TableName: salesTableName,
        Key: {
          id: uuid,
        },
      })
      .promise();
  } catch (err) {
    return errorResponse(err, event.requestContext.requestId);
  }

  const deleted = await redisClient.zrem(QUEUES.IN_PROCESS, uuid);
  return buildResponse(200, { result, deleted });
};
