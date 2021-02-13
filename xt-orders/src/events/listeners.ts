import { Message } from 'node-nats-streaming';
import {
  Subjects,
  Listener,
  TicketCreatedEvent,
  TicketUpdatedEvent,
  NotFoundError,
  ExpirationCompleteEvent,
  OrderStatus,
  PaymentCreatedEvent,
} from '@gb-xtickets/common';
import { Ticket } from '../models/ticket';
import { Order } from '../models/order';
import { OrderCancelledPublisher } from './publishers';

const QUEUE_GROUP_NAME = 'order-service';

export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
  readonly subject = Subjects.TicketCreated;
  queueGroupName = QUEUE_GROUP_NAME;

  async onMessage(data: TicketCreatedEvent['data'], msg: Message) {
    const { title, price, id } = data;
    const ticket = Ticket.build({
      id,
      title,
      price,
    });

    await ticket.save();

    msg.ack();
  }
}

export class TicketUpdatedListener extends Listener<TicketUpdatedEvent> {
  readonly subject = Subjects.TicketUpdated;
  queueGroupName = QUEUE_GROUP_NAME;

  async onMessage(data: TicketUpdatedEvent['data'], msg: Message) {
    const { title, price, id, version } = data;

    const ticket = await Ticket.findByEvent({ id, version });

    if (!ticket) {
      throw new NotFoundError(
        `[TicketUpdatedListener] - Ticket with id: ${id} and version: ${version} not found`
      );
    }

    ticket.set({
      title,
      price,
    });
    await ticket.save();

    msg.ack();
  }
}

export class ExpirationCompleteListener extends Listener<ExpirationCompleteEvent> {
  readonly subject = Subjects.ExpirationComplete;
  queueGroupName = QUEUE_GROUP_NAME;

  async onMessage(data: ExpirationCompleteEvent['data'], msg: Message) {
    const { orderId } = data;

    const order = await Order.findById(orderId).populate('ticket');

    if (!order) {
      throw new NotFoundError(
        `[ExpirationCompleteListener] - Order with id: ${orderId} not found`
      );
    }

    if (order.status === OrderStatus.Complete) {
      return msg.ack();
    }

    order.set({
      status: OrderStatus.Cancelled,
    });

    await order.save();

    await new OrderCancelledPublisher(this.client).publish({
      id: order.id,
      version: order.version,
      ticket: {
        id: order.ticket.id,
      },
    });

    msg.ack();
  }
}

export class PaymentCreatedListener extends Listener<PaymentCreatedEvent> {
  readonly subject = Subjects.PaymentCreated;
  queueGroupName = QUEUE_GROUP_NAME;

  async onMessage(data: PaymentCreatedEvent['data'], msg: Message) {
    const order = await Order.findById(data.orderId);

    if (!order) {
      throw new NotFoundError(
        `[PaymentCreatedListener] - order with id: ${data.orderId} not found`
      );
    }

    order.set({
      status: OrderStatus.Complete,
    });

    // TODO: create order update event and publish it

    await order.save();

    msg.ack();
  }
}
