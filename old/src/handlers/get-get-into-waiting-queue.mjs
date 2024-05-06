import AWS from "aws-sdk";
import { OperationEnum } from "../operations.mjs";
import { v4 as uuid } from "uuid";
import { elasticacheLambdaRequest } from "../elasticache-lambda-request.mjs";

export const handler = async (event) => {
  if (event.httpMethod !== "GET") {
    throw new Error(
      `getMethod only accept GET method, you tried: ${event.httpMethod}`
    );
  }
  console.info("received:", event);

  const result = await elasticacheLambdaRequest(
    OperationEnum.CREATE,
    uuid(),
    event.pathParameters.userId
  );

  // try {
  //   const data = await ddbDocClient.send(new PutCommand(params));
  //   console.log("Success - item added or updated", data);
  // } catch (err) {
  //   console.log("Error", err.stack);
  // }

  const response = {
    statusCode: 200,
    body: JSON.stringify(result),
  };

  console.info(
    `response from: ${event.path} statusCode: ${response.statusCode} body: ${response.body}`
  );
  return response;
};
