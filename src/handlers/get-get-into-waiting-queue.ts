import { OPERATION } from "../constants";
import { v4 as uuid } from "uuid";
import { elasticacheLambdaRequest } from "../helpers/elasticache-lambda-request";
import { APIGatewayProxyEvent } from "aws-lambda";

export const handler = async (event: APIGatewayProxyEvent) => {
  if (event.httpMethod !== "GET") {
    throw new Error(
      `getMethod only accept GET method, you tried: ${event.httpMethod}`
    );
  }
  console.info("received:", event);

  const result = await elasticacheLambdaRequest(
    OPERATION.CREATE,
    uuid(),
    Math.floor(new Date().getTime() / 1000).toString()
  );

  const response = {
    statusCode: 200,
    body: JSON.stringify(result),
  };

  console.info(
    `response from: ${event.path} statusCode: ${response.statusCode} body: ${response.body}`
  );
  return response;
};
