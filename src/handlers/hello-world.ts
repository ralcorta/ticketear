import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { v4 as uuid } from 'uuid';

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    return {
        statusCode: 200,
        headers: {
            'Access-Control-Allow-Headers': 'Content-Type',
            'Access-Control-Allow-Origin': '*', // Allow from anywhere
            'Access-Control-Allow-Methods': 'GET', // Allow only GET request
        },
        body: JSON.stringify({
            message: 'hola 2',
        }),
    };
};
