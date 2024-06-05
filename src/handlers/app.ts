export default {
    async handler(request: Request): Promise<Response> {
        console.log(request.headers.get('x-amzn-function-arn'));
        // ...
        return new Response(JSON.stringify({ message: 'Hello CodeFactory2' }), {
            status: 200,
            headers: {
                'Content-Type': 'text/plain',
            },
        });
    },
};
