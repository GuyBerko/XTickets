import Queue from 'bull';
import { ExpirationCompletePublisher } from '../events/publishers';
import { natsClient } from '../nats-client';

interface Payload {
  orderId: string;
}

const expirationQueue = new Queue<Payload>('order:expiration', {
  redis: {
    host: process.env.REDIS_HOST,
  },
});

expirationQueue.process(async (job) => {
  new ExpirationCompletePublisher(natsClient.client).publish({
    orderId: job.data.orderId,
  });
});

export { expirationQueue };
