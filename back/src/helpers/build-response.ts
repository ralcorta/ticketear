import { APIGatewayProxyResult } from 'aws-lambda';

export const buildResponse = (
    statusCode: number,
    message?: any,
    error?: Error,
    requestId?: string,
): APIGatewayProxyResult => {
    const response = {
        isBase64Encoded: false,
        statusCode: statusCode,
        body: JSON.stringify(
            {
                ...(message && { message: message }),
                ...(error && { error: error.name, errorMessage: error.message }),
                ...(requestId && { requestId: requestId }),
            },
            null,
            2,
        ),
        headers: { 'Content-Type': 'application/json' },
    };

    console.info(`[Lambda Response : ${statusCode}] Body: `, JSON.stringify(message));

    return response;
};
