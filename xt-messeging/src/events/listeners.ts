import {
  Listener,
  OrderCreatedEvent,
  PaymentCreatedEvent,
  TicketCreatedEvent,
  TicketUpdatedEvent,
  UserCreatedEvent,
  NotFoundError,
  Subjects,
} from '@gb-xtickets/common';
import { Message } from 'node-nats-streaming';
import {
  orderQueue,
  OrderQueueTypes,
  jobsRemainderMap,
} from '../queues/order-queue';
import { userCreatedQueue } from '../queues/user-queue';
import { Order } from '../models/order';
import { Ticket } from '../models/ticket';
import { User } from '../models/user';

const QUEUE_GROUP_NAME = 'messeging-service';

export class PaymentCreatedListener extends Listener<PaymentCreatedEvent> {
  readonly subject = Subjects.PaymentCreated;
  queueGroupName = QUEUE_GROUP_NAME;

  async onMessage(data: PaymentCreatedEvent['data'], msg: Message) {
    // Find order in the db
    const order = await Order.findById(data.orderId)
      .populate('ticket')
      .populate('user');

    // If cannot find order throw error
    if (!order) {
      throw new NotFoundError(
        `[PaymentCreatedListener] - order with id: ${data.id} not found`
      );
    }

    // Add email to queue
    await orderQueue.add({
      order,
      ticket: order.ticket,
      user: order.user,
      type: OrderQueueTypes.OrderCompleted,
    });

    // Acknowledge the message
    msg.ack();
  }
}

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated;
  queueGroupName = QUEUE_GROUP_NAME;
  readonly DELAY: number = 10 * 60 * 1000;

  async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
    // Find the ticket in the db
    const ticket = await Ticket.findById(data.ticket.id);

    // If ticket not found throw error
    if (!ticket) {
      throw new NotFoundError(
        `[OrderCreatedListener] - ticket with id: ${data.ticket.id} not found`
      );
    }

    // Find the user in the db
    const user = await User.findById(data.userId);

    // If ticket not found throw error
    if (!user) {
      throw new NotFoundError(
        `[OrderCreatedListener] - user with id: ${data.userId} not found`
      );
    }

    // Create new order
    const order = Order.build({
      id: data.id,
      ticket,
      user,
      status: data.status,
      createdAt: data.createdAt,
      tax: data.tax,
      quantity: data.quantity,
    });

    // Save the order
    await order.save();

    // Add email remainder to queue
    const job = await orderQueue.add(
      {
        order,
        ticket: order.ticket,
        user: order.user,
        type: OrderQueueTypes.OrderRemainder,
      },
      {
        delay: this.DELAY,
      }
    );

    // Add job to map so we be able to delete it if nessery
    jobsRemainderMap[order.id] = job.id;

    // acknowledge the message
    msg.ack();
  }
}

export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
  readonly subject = Subjects.TicketCreated;
  queueGroupName = QUEUE_GROUP_NAME;

  async onMessage(data: TicketCreatedEvent['data'], msg: Message) {
    const { title, price, id, date, description } = data;

    const ticket = Ticket.build({
      id,
      title,
      price,
      date,
      description,
    });

    await ticket.save();

    msg.ack();
  }
}

export class TicketUpdatedListener extends Listener<TicketUpdatedEvent> {
  readonly subject = Subjects.TicketUpdated;
  queueGroupName = QUEUE_GROUP_NAME;

  async onMessage(data: TicketUpdatedEvent['data'], msg: Message) {
    const { title, price, id, version, date, description } = data;

    const ticket = await Ticket.findByEvent({ id, version });

    if (!ticket) {
      throw new NotFoundError(
        `[TicketUpdatedListener] - Ticket with id: ${id} and version: ${version} not found`
      );
    }

    ticket.set({
      title,
      price,
      date,
      description,
    });
    await ticket.save();

    msg.ack();
  }
}

export class UserCreatedListener extends Listener<UserCreatedEvent> {
  readonly subject = Subjects.UserCreated;
  queueGroupName = QUEUE_GROUP_NAME;

  async onMessage(data: UserCreatedEvent['data'], msg: Message) {
    const { id, email, name } = data;

    const user = User.build({
      id,
      email,
      name,
    });

    await user.save();

    await userCreatedQueue.add({
      user,
    });

    msg.ack();
  }
}
