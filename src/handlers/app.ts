import type { Server, ServerWebSocket } from 'bun';
// import {  } from 'uuid';

export default {
    async fetch(request: Request, server: Server): Promise<Response | undefined> {
        console.log('Request', {
            url: request.url,
            method: request.method,
            headers: request.headers.toJSON(),
            body: request.body ? await request.text() : null,
        });
        return new Response('Hello from Bun on Lambda updated!', {
            status: 200,
            headers: {
                'Content-Type': 'text/plain;charset=utf-8',
            },
        });
    },
};

// export default {
//     async fetch(request: Request): Promise<any> {
//         console.log('REQUEST ENTRANTE');
//         return {
//             isBase64Encoded: false,
//             statusCode: 200,
//             body: JSON.stringify(
//                 {
//                     message: 'hola',
//                 },
//                 null,
//                 2,
//             ),
//             headers: { 'Content-Type': 'application/json' },
//         };
//     },
// };
