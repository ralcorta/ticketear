import AWS from "aws-sdk";
import { PromiseResult } from "aws-sdk/lib/request";

const sqsClient = new AWS.SQS({ apiVersion: "2012-11-05" });
// const queueUrl = `http://host.docker.internal:4566/000000000000/${process.env.SQS_QUEUE_NAME}`;
const queueUrl =
  process.env.STAGE === "dev"
    ? "http://host.docker.internal:4566/000000000000/general-queue"
    : (process.env.SQS_QUEUE_URL as string);

async function sendMessage(
  message: string
): Promise<PromiseResult<AWS.SQS.SendMessageResult, AWS.AWSError>> {
  const params = {
    MessageBody: message,
    QueueUrl: queueUrl,
  };

  let result: PromiseResult<AWS.SQS.SendMessageResult, AWS.AWSError>;
  try {
    result = await sqsClient.sendMessage(params).promise();
    console.log("Message sent:", result.MessageId);
  } catch (error) {
    console.error("Error sending message:", error);
    throw error;
  }

  return result;
}

async function receiveMessages(): Promise<
  PromiseResult<AWS.SQS.ReceiveMessageResult, AWS.AWSError>
> {
  const params = {
    QueueUrl: queueUrl,
    MaxNumberOfMessages: 1,
    VisibilityTimeout: 5,
    WaitTimeSeconds: 5,
  };

  let result: PromiseResult<AWS.SQS.ReceiveMessageResult, AWS.AWSError>;
  try {
    result = await sqsClient.receiveMessage(params).promise();

    if (result.Messages && result.Messages.length > 0) {
      const message = result.Messages[0];
      console.log("Received message:", message.Body);

      // Delete the received message from the queue
      await sqsClient
        .deleteMessage({
          QueueUrl: queueUrl,
          ReceiptHandle: message.ReceiptHandle!,
        })
        .promise();
    } else {
      console.log("No messages available");
    }
  } catch (error) {
    console.error("Error receiving messages:", error);
    throw error;
  }

  return result;
}

export { sqsClient, sendMessage, receiveMessages };
