import { APIGatewayProxyEvent } from "aws-lambda";
import { QUEUES } from "../constants";
import { redisClient } from "../helpers/redis-client";
import { buildResponse } from "../helpers/build-response";
import { errorResponse } from "../helpers/error-response";
import { dynamodb } from "../helpers/dynamo-client";

const salesTableName = process.env.SALES_TABLE ?? "";

export const handler = async (event: APIGatewayProxyEvent) => {
  try {
    const waitingQueue = await redisClient.zrange(QUEUES.WAITING, 0, 1000);
    const inProcessQueue = (await redisClient.keys("*")).filter(
      (key) => key !== QUEUES.WAITING
    );
    const salesTableDynamo = await dynamodb
      .scan({
        TableName: salesTableName,
      })
      .promise();
    return buildResponse(200, {
      waitingQueue,
      inProcessQueue,
      salesTableDynamo,
    });
  } catch (error) {
    return errorResponse(error, event.requestContext.requestId);
  }
};
