import AWS from "aws-sdk";

let params: Record<string, any> = {};

if (process.env.STAGE === "dev") {
  params = {
    endpoint: "http://host.docker.internal:4566",
  };
}

const dynamodb = new AWS.DynamoDB.DocumentClient(params);

export { dynamodb };
