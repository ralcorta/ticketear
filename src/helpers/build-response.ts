export interface BuildResponseParams {
    request?: Request;
    statusCode?: number;
    message?: any;
    error?: Error;
    requestId?: string;
}

export const buildResponse = async (params: BuildResponseParams): Promise<Response | undefined> => {
    const { request, statusCode, message, error, requestId } = params;
    if (request) {
        console.log('Request', {
            url: request.url,
            method: request.method,
            headers: request.headers.toJSON(),
            body: request.body ? await request.text() : null,
        });
    }

    console.info(`[Lambda Response : ${statusCode}] Body: `, JSON.stringify(message));
    return new Response(
        JSON.stringify({
            ...(message && { message: message }),
            ...(error && { error: error.name, errorMessage: error.message }),
            ...(requestId && { requestId: requestId }),
        }),
        {
            status: statusCode ?? 200,
            headers: {
                'Content-Type': 'application/json', // text/plain;charset=utf-8
            },
        },
    );
};
