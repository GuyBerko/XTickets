import { Listener, OrderCreatedEvent, Subjects } from '@gb-xtickets/common';
import { Message } from 'node-nats-streaming';
import { expirationQueue } from '../queues/expiration-queue';

const QUEUE_GROUP_NAME = 'expiration-service';

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated;
  queueGroupName = QUEUE_GROUP_NAME;

  async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
    const delay = new Date(data.expiresAt).getTime() - new Date().getTime();

    await expirationQueue.add(
      {
        orderId: data.id,
      },
      {
        delay,
      }
    );

    msg.ack();
  }
}
