import {
  Listener,
  NotFoundError,
  OrderCreatedEvent,
  OrderCancelledEvent,
  Subjects,
  OrderStatus,
} from '@gb-xtickets/common';
import { Message } from 'node-nats-streaming';
import { Order } from '../models/order';

const QUEUE_GROUP_NAME = 'payments-service';

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated;
  queueGroupName: string = QUEUE_GROUP_NAME;

  async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
    // Create new order
    const order = Order.build({
      id: data.id,
      price: data.ticket.price,
      status: data.status,
      userId: data.userId,
      version: data.version,
    });

    // Save the order
    await order.save();

    // Acknowledging the message
    msg.ack();
  }
}

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
  readonly subject = Subjects.OrderCancelled;
  queueGroupName: string = QUEUE_GROUP_NAME;

  async onMessage(data: OrderCancelledEvent['data'], msg: Message) {
    // Find the order that should be cancelled
    const order = await Order.findOne({
      _id: data.id,
      version: data.version - 1, // set it to custom function
    });

    // If no order found throw error
    if (!order) {
      throw new NotFoundError(
        `[OrderCancelledListener] - Order with id: ${data.id} not found`
      );
    }

    // Set the order status to cancelled
    order.set({ status: OrderStatus.Cancelled });

    // Save the order
    await order.save();

    // Acknowledging the message
    msg.ack();
  }
}
