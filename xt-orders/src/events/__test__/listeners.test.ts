import {
  ExpirationCompleteEvent,
  OrderStatus,
  TicketCategory,
  TicketCreatedEvent,
  TicketUpdatedEvent,
} from '@gb-xtickets/common';
import mongoose from 'mongoose';
import { Message } from 'node-nats-streaming';
import {
  ExpirationCompleteListener,
  TicketCreatedListener,
  TicketUpdatedListener,
} from '../listeners';
import { natsClient } from '../../nats-client';
import { Ticket } from '../../models/ticket';
import { Order } from '../../models/order';

describe('Listeners', () => {
  describe('Ticket Created Listener', () => {
    const setup = async () => {
      // Create an instance of the listener
      const listener = new TicketCreatedListener(natsClient.client);

      // Create a fake data event
      const data: TicketCreatedEvent['data'] = {
        version: 0,
        id: new mongoose.Types.ObjectId().toHexString(),
        userId: new mongoose.Types.ObjectId().toHexString(),
        title: 'concert',
        price: 10,
        date: new Date(),
        category: TicketCategory.Comedy,
        description: 'desc',
      };

      // Create a fake message object
      const msg: Message = {
        ack: jest.fn(),
        getSubject: jest.fn(),
        getSequence: jest.fn(),
        getRawData: jest.fn(),
        getData: jest.fn(),
        getTimestampRaw: jest.fn(),
        getTimestamp: jest.fn(),
        isRedelivered: jest.fn(),
        getCrc32: jest.fn(),
      };

      return {
        listener,
        data,
        msg,
      };
    };

    it('should create and save a ticket', async () => {
      const { listener, data, msg } = await setup();
      // Invoke the onMessage function with the data object + message object
      await listener.onMessage(data, msg);
      // Write assertions to make sure a ticket was created
      const ticket = await Ticket.findById(data.id);
      expect(ticket).toBeDefined();
      expect(ticket!.title).toEqual(data.title);
      expect(ticket!.price).toEqual(data.price);
    });

    it('should acknowledge the message', async () => {
      const { listener, data, msg } = await setup();
      // Invoke the onMessage function with the data object + message object
      await listener.onMessage(data, msg);
      // Write assertions to make sure ack function was called
      expect(msg.ack).toHaveBeenCalled();
    });
  });

  describe('Ticket Updated Listener', () => {
    const setup = async () => {
      // Create an instance of the listener
      const listener = new TicketUpdatedListener(natsClient.client);

      // Create and save a ticket
      const ticket = Ticket.build({
        title: 'concert',
        price: 20,
        id: new mongoose.Types.ObjectId().toHexString(),
        date: new Date(),
      });

      await ticket.save();

      // Create a fake data event
      const data: TicketUpdatedEvent['data'] = {
        version: ticket.version + 1,
        id: ticket.id,
        userId: new mongoose.Types.ObjectId().toHexString(),
        title: 'updated concert',
        price: 30,
        category: TicketCategory.Comedy,
        date: new Date(),
        description: 'desc',
      };

      // Create a fake message object
      const msg: Message = {
        ack: jest.fn(),
        getSubject: jest.fn(),
        getSequence: jest.fn(),
        getRawData: jest.fn(),
        getData: jest.fn(),
        getTimestampRaw: jest.fn(),
        getTimestamp: jest.fn(),
        isRedelivered: jest.fn(),
        getCrc32: jest.fn(),
      };

      return {
        listener,
        data,
        msg,
        ticket,
      };
    };

    it('should finds, update and save a ticket', async () => {
      const { listener, data, msg, ticket } = await setup();
      // Invoke the onMessage function with the data object + message object
      await listener.onMessage(data, msg);
      // Write assertions to make sure the ticket was updated
      const updatedTicket = await Ticket.findById(ticket.id);
      expect(updatedTicket!.title).toEqual(data.title);
      expect(updatedTicket!.price).toEqual(data.price);
      expect(updatedTicket!.version).toEqual(data.version);
    });

    it('should acknowledge the message', async () => {
      const { listener, data, msg } = await setup();
      // Invoke the onMessage function with the data object + message object
      await listener.onMessage(data, msg);
      // Write assertions to make sure ack function was called
      expect(msg.ack).toHaveBeenCalled();
    });

    it('should not acknowledge message if event has a skipped version number', async () => {
      const { listener, data, msg, ticket } = await setup();
      // Increase the version to invalid version
      data.version = 3;
      // Invoke the onMessage function with the data object + message object and expect to throw error
      await expect(listener.onMessage(data, msg)).rejects.toThrow();
      // Write assertions to make sure the ticket was not updated and message was not acknowledged
      const storedTicket = await Ticket.findById(ticket.id);
      expect(storedTicket!.title).toEqual(ticket.title);
      expect(storedTicket!.price).toEqual(ticket.price);
      expect(storedTicket!.version).toEqual(ticket.version);
      expect(msg.ack).not.toHaveBeenCalled();
    });
  });

  describe('Expiration Complete Listener', () => {
    const setup = async () => {
      // Create an instance of the listener
      const listener = new ExpirationCompleteListener(natsClient.client);

      // Create and save a ticket
      const ticket = Ticket.build({
        title: 'concert',
        price: 20,
        id: new mongoose.Types.ObjectId().toHexString(),
        date: new Date(),
      });

      await ticket.save();

      // Create and save order
      const order = Order.build({
        status: OrderStatus.Created,
        userId: 'someFakeId',
        expiresAt: new Date(),
        ticket,
        quantity: 1,
      });

      await order.save();

      // Create a fake data event
      const data: ExpirationCompleteEvent['data'] = {
        orderId: order.id,
      };

      // Create a fake message object
      const msg: Message = {
        ack: jest.fn(),
        getSubject: jest.fn(),
        getSequence: jest.fn(),
        getRawData: jest.fn(),
        getData: jest.fn(),
        getTimestampRaw: jest.fn(),
        getTimestamp: jest.fn(),
        isRedelivered: jest.fn(),
        getCrc32: jest.fn(),
      };

      return {
        listener,
        data,
        msg,
        ticket,
        order,
      };
    };

    it('should finds, update and save a order', async () => {
      const { listener, data, msg, order } = await setup();
      // Invoke the onMessage function with the data object + message object
      await listener.onMessage(data, msg);
      // Write assertions to make sure the order was updated
      const updatedOrder = await Order.findById(order.id);
      expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);
    });

    it('should acknowledge the message', async () => {
      const { listener, data, msg } = await setup();
      // Invoke the onMessage function with the data object + message object
      await listener.onMessage(data, msg);
      // Write assertions to make sure ack function was called
      expect(msg.ack).toHaveBeenCalled();
    });

    it('should publish OrderCancelled event', async () => {
      const { listener, data, msg, order } = await setup();
      // Invoke the onMessage function with the data object + message object
      await listener.onMessage(data, msg);
      expect(natsClient.client.publish).toBeCalledTimes(1);
      const mockCall = (natsClient.client.publish as jest.Mock).mock.calls[0];
      expect(mockCall[0]).toEqual('order:cancelled');
      expect(mockCall[1]).toEqual(
        JSON.stringify({
          id: order.id,
          version: order.version + 1,
          ticket: {
            id: order.ticket.id,
          },
        })
      );
    });

    it('should throw error if order was not found', async () => {
      const { listener, data, msg, order } = await setup();
      // Change the id to invalid id
      data.orderId = mongoose.Types.ObjectId().toHexString();
      // Invoke the onMessage function with the data object + message object and expect to throw error
      await expect(listener.onMessage(data, msg)).rejects.toThrow();
      // Write assertions to make sure the order was not updated and message was not acknowledged
      const storedOrder = await Order.findById(order.id);
      expect(storedOrder!.status).toEqual(order.status);
      expect(msg.ack).not.toHaveBeenCalled();
    });
  });
});
