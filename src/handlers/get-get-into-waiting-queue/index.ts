import { v4 as uuid } from 'uuid';
import { QUEUES } from '../../constants';
import { redisClient } from '../../helpers/redis-client';
import { sendMessage } from '../../helpers/sqs-client';
import { buildResponse } from '../../helpers/build-response';

export const handler = async () => {
    const token = uuid();
    await redisClient.zadd(QUEUES.WAITING, new Date().getTime(), token);
    const sqs = await sendMessage(JSON.stringify({ stage: QUEUES.WAITING, uuid: token }));
    return buildResponse(200, { token, sqs });
};
