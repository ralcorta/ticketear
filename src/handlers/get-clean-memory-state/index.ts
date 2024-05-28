import { APIGatewayProxyEvent } from 'aws-lambda';
import { redisClient } from '../../helpers/redis-client';
import { buildResponse } from '../../helpers/build-response';
import { errorResponse } from '../../helpers/error-response';
import { dynamodb } from '../../helpers/dynamo-client';

const salesTableName = process.env.SALES_TABLE ?? '';

export const handler = async (event: APIGatewayProxyEvent) => {
    try {
        await redisClient.flushall();
        const salesTableDynamo = await dynamodb
            .scan({
                TableName: salesTableName,
            })
            .promise();
        if (salesTableDynamo?.Items) {
            for (const item of salesTableDynamo.Items) {
                await dynamodb
                    .delete({
                        TableName: salesTableName,
                        Key: {
                            id: item.id,
                        },
                    })
                    .promise();
            }
        }
        return buildResponse(200, {});
    } catch (error) {
        return errorResponse(error, event.requestContext.requestId);
    }
};
