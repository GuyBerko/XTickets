import {
  OrderCreatedEvent,
  OrderCancelledEvent,
  OrderStatus,
  TicketCategory,
} from '@gb-xtickets/common';
import mongoose from 'mongoose';
import { OrderCreatedListener, OrderCancelledListener } from '../listeners';
import { natsClient } from '../../nats-client';
import { Ticket } from '../../models/ticket';
import { Message } from 'node-nats-streaming';

describe('Listeners', () => {
  describe('Order Created Listener', () => {
    const setup = async () => {
      // Create an instance of the listener
      const listener = new OrderCreatedListener(natsClient.client);

      // Create and save a ticket
      const ticket = Ticket.build({
        title: 'concert',
        price: 99,
        userId: 'abc123',
        description: 'desc',
        category: TicketCategory.Comedy,
        image: '',
        date: new Date(),
      });
      await ticket.save();

      // Create the fake data event
      const data: OrderCreatedEvent['data'] = {
        id: mongoose.Types.ObjectId().toHexString(),
        version: 0,
        expiresAt: '99-99-9999',
        userId: 'def456',
        status: OrderStatus.Created,
        ticket: {
          price: ticket.price,
          id: ticket.id,
        },
      };

      // @ts-ignore
      const msg: Message = {
        ack: jest.fn(),
      };

      return {
        listener,
        data,
        msg,
        ticket,
      };
    };

    it('should set the orderId in the ticket', async () => {
      const { listener, data, msg, ticket } = await setup();

      // Invoke onMessage
      await listener.onMessage(data, msg);

      // Fetch the ticket from the database
      const updatedTicket = await Ticket.findById(ticket.id);

      // Check that the ticket order id was updated with the event order id
      expect(updatedTicket!.orderId).toEqual(data.id);
    });

    it('should acknowledge the message', async () => {
      const { listener, data, msg } = await setup();

      // Invoke onMessage
      await listener.onMessage(data, msg);

      // Check that the message was acknowledged
      expect(msg.ack).toHaveBeenCalled();
    });

    it('should throw an error and not acknowledge the message if ticket was not found', async () => {
      const { listener, data, msg } = await setup();

      // Change the ticket id to different id
      data.ticket.id = mongoose.Types.ObjectId().toHexString();

      // Invoke onMessage and expect it to throw error because the ticket was not found
      await expect(listener.onMessage(data, msg)).rejects.toThrow();

      // Check that the message was not acknowledged
      expect(msg.ack).not.toHaveBeenCalled();
    });

    it('should publish an ticket update event', async () => {
      const { listener, data, msg, ticket } = await setup();

      // Invoke onMessage
      await listener.onMessage(data, msg);

      // Check that publish was invoke
      expect(natsClient.client.publish).toHaveBeenCalled();

      const firstCall = (natsClient.client.publish as jest.Mock).mock.calls[0];
      const jsonData = JSON.stringify({
        id: ticket.id,
        price: ticket.price,
        title: ticket.title,
        userId: ticket.userId,
        orderId: data.id,
        version: ticket.version + 1,
        category: ticket.category,
        date: ticket.date,
      });

      // Cheack that the event type was ticket updated event
      expect(firstCall[0]).toEqual('ticket:updated');
      // Check that the event data is correct
      expect(firstCall[1]).toEqual(jsonData);
    });
  });

  describe('Order Cancelled Listener', () => {
    const setup = async () => {
      // Create an instance of the listener
      const listener = new OrderCancelledListener(natsClient.client);

      // Create fake order id
      const orderId = mongoose.Types.ObjectId().toHexString();

      // Create, set it's order id and save a ticket
      const ticket = Ticket.build({
        title: 'concert',
        price: 99,
        userId: 'abc123',
        description: 'desc',
        category: TicketCategory.Comedy,
        image: '',
        date: new Date(),
      });
      ticket.set({ orderId });
      await ticket.save();

      // Create the fake data event
      const data: OrderCancelledEvent['data'] = {
        id: mongoose.Types.ObjectId().toHexString(),
        version: ticket.version,
        ticket: {
          id: ticket.id,
        },
      };

      // @ts-ignore
      const msg: Message = {
        ack: jest.fn(),
      };

      return {
        listener,
        data,
        msg,
        ticket,
      };
    };

    it('should set the orderId to undefined in the ticket', async () => {
      const { listener, data, msg, ticket } = await setup();

      // Invoke onMessage
      await listener.onMessage(data, msg);

      // Fetch the ticket from the database
      const updatedTicket = await Ticket.findById(ticket.id);

      // Check that the ticket order id was updated with the event order id
      expect(updatedTicket!.orderId).not.toBeDefined();
    });

    it('should acknowledge the message', async () => {
      const { listener, data, msg } = await setup();

      // Invoke onMessage
      await listener.onMessage(data, msg);

      // Check that the message was acknowledged
      expect(msg.ack).toHaveBeenCalled();
    });

    it('should throw an error and not acknowledge the message if ticket was not found', async () => {
      const { listener, data, msg } = await setup();

      // Change the ticket id to different id
      data.ticket.id = mongoose.Types.ObjectId().toHexString();

      // Invoke onMessage and expect it to throw error because the ticket was not found
      await expect(listener.onMessage(data, msg)).rejects.toThrow();

      // Check that the message was not acknowledged
      expect(msg.ack).not.toHaveBeenCalled();
    });

    it('should publish an ticket update event', async () => {
      const { listener, data, msg, ticket } = await setup();

      // Invoke onMessage
      await listener.onMessage(data, msg);

      // Check that publish was invoke
      expect(natsClient.client.publish).toHaveBeenCalled();

      const firstCall = (natsClient.client.publish as jest.Mock).mock.calls[0];
      const jsonData = JSON.stringify({
        id: ticket.id,
        price: ticket.price,
        title: ticket.title,
        userId: ticket.userId,
        orderId: undefined,
        version: ticket.version + 1,
        category: ticket.category,
        date: ticket.date,
      });

      // Cheack that the event type was ticket updated event
      expect(firstCall[0]).toEqual('ticket:updated');
      // Check that the event data is correct
      expect(firstCall[1]).toEqual(jsonData);
    });
  });
});
