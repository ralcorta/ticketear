// import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
// import { DynamoDBDocumentClient, GetCommand } from "@aws-sdk/lib-dynamodb";
// const client = new DynamoDBClient({});
// const ddbDocClient = DynamoDBDocumentClient.from(client);
import { APIGatewayProxyEvent } from "aws-lambda";
import { QUEUES } from "../constants";
import { buildResponse } from "../helpers/build-response";
import { redisClient } from "../helpers/redis-client";

// const inProcessTableName = process.env.IN_PROCESS_TABLE;

export const handler = async (event: APIGatewayProxyEvent) => {
  if (event.httpMethod !== "GET")
    throw new Error(
      `getMethod only accept GET method, you tried: ${event.httpMethod}`
    );
  if (!event.pathParameters?.uuid)
    throw new Error(`Token UUID not provided in the path.`);

  console.info("received:", event.pathParameters);

  const { uuid } = event.pathParameters;
  const positionOnWaitingQueue = await redisClient.zrank(QUEUES.WAITING, uuid);
  const positionOnInProgressQueue = await redisClient.zrank(
    QUEUES.IN_PROCESS,
    uuid
  );

  // let dataInProcessTable: any;
  // try {
  //   dataInProcessTable = await ddbDocClient.send(
  //     new GetCommand({
  //       TableName: inProcessTableName,
  //       Key: { uuid },
  //     })
  //   );
  // } catch (err) {
  //   console.log("Error!!", err);
  // }

  // const body: Record<string, any> = {};

  // if (positionOnWaitingList) body.positionOnWaitingList = positionOnWaitingList;
  // else if (dataInProcessTable) body.dataInProcessTable = dataInProcessTable;

  return buildResponse(200, {
    positionOnWaitingQueue,
    positionOnInProgressQueue,
  });
};
