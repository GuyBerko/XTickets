import {
  Listener,
  NotFoundError,
  OrderCreatedEvent,
  OrderCancelledEvent,
  Subjects,
} from '@gb-xtickets/common';
import { Message } from 'node-nats-streaming';
import { Ticket } from '../models/ticket';
import { TicketUpdatedPublisher } from './publishers';

const QUEUE_GROUP_NAME = 'tickets-service';

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated;
  queueGroupName: string = QUEUE_GROUP_NAME;

  async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
    // Find the ticket that the order is reserving
    const ticket = await Ticket.findById(data.ticket.id);

    // If no ticket throw error
    if (!ticket) {
      throw new NotFoundError(`Ticket with id: ${data.ticket.id} not found`);
    }

    // Mark the ticket as being reserved by setting its orderId property
    ticket.set({ orderId: data.id });

    // Save the ticket
    await ticket.save();

    // Publish ticket updated event
    await new TicketUpdatedPublisher(this.client).publish({
      id: ticket.id,
      price: ticket.price,
      title: ticket.title,
      userId: ticket.userId,
      orderId: ticket.orderId,
      version: ticket.version,
    });

    // Acknowledging the message
    msg.ack();
  }
}

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
  readonly subject = Subjects.OrderCancelled;
  queueGroupName: string = QUEUE_GROUP_NAME;

  async onMessage(data: OrderCancelledEvent['data'], msg: Message) {
    // Find the ticket that the order is reserving
    const ticket = await Ticket.findById(data.ticket.id);

    // If no ticket throw error
    if (!ticket) {
      throw new NotFoundError(`Ticket with id: ${data.ticket.id} not found`);
    }

    // Unmark the ticket as being reserved by setting its orderId property to undefined
    ticket.set({ orderId: undefined });

    // Save the ticket
    await ticket.save();

    // Publish ticket updated event
    await new TicketUpdatedPublisher(this.client).publish({
      id: ticket.id,
      price: ticket.price,
      title: ticket.title,
      userId: ticket.userId,
      orderId: undefined,
      version: ticket.version,
    });

    // Acknowledging the message
    msg.ack();
  }
}
