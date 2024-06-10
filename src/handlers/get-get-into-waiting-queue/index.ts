import { v4 as uuid } from 'uuid';
import { QUEUES } from '../../constants.ts';
import { sendMessage } from '../../helpers/sqs-client.ts';
import { redisClient } from '../../helpers/redis-client.ts';
import { buildResponse } from '../../helpers/build-response.ts';

export default {
    async fetch(request: Request): Promise<Response | undefined> {
        const token = uuid();
        await redisClient.zadd(QUEUES.WAITING, new Date().getTime(), token);
        const sqs = await sendMessage(JSON.stringify({ stage: QUEUES.WAITING, uuid: token }));
        console.log('change8');
        return buildResponse({ request, message: { token, sqs } });
    },
};
