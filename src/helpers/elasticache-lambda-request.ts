import AWS from "aws-sdk";
import { OPERATION } from "../constants";

export async function elasticacheLambdaRequest(
  operation: OPERATION,
  key: string,
  value: string
) {
  AWS.config.update({ region: "us-east-1" });
  const lambda = new AWS.Lambda({
    endpoint: "http://host.docker.internal:4566",
  });
  const params = {
    FunctionName: "ElasticacheManager",
    InvocationType: "RequestResponse",
    Payload: JSON.stringify({
      payload: {
        key,
        value,
      },
      operation,
    }),
  };
  return lambda.invoke(params).promise();
}
