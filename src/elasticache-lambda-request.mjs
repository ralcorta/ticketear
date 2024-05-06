import AWS from "aws-sdk";

export async function elasticacheLambdaRequest(operation, key, value) {
  const lambda = new AWS.Lambda();
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
