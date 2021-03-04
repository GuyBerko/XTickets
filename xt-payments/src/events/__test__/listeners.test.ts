import {
  OrderCreatedEvent,
  OrderCancelledEvent,
  OrderStatus,
} from '@gb-xtickets/common';
import mongoose from 'mongoose';
import { OrderCreatedListener, OrderCancelledListener } from '../listeners';
import { natsClient } from '../../nats-client';
import { Message } from 'node-nats-streaming';
import { Order } from '../../models/order';

describe('Listeners', () => {
  describe('Order Created Listener', () => {
    const setup = async () => {
      // Create an instance of the listener
      const listener = new OrderCreatedListener(natsClient.client);

      // Create the fake data event
      const data: OrderCreatedEvent['data'] = {
        id: mongoose.Types.ObjectId().toHexString(),
        version: 0,
        expiresAt: '99-99-9999',
        userId: 'def456',
        status: OrderStatus.Created,
        quantity: 1,
        createdAt: new Date(),
        tax: 0.17,
        ticket: {
          price: 20,
          id: 'ticketId',
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
      };
    };

    it('should build and save new order', async () => {
      const { listener, data, msg } = await setup();

      // Invoke onMessage
      await listener.onMessage(data, msg);

      // Fetch the order from the database
      const savedOrder = await Order.findById(data.id);

      // Check that the order was saved with the currect data
      expect(savedOrder!.id).toEqual(data.id);
      expect(savedOrder!.version).toEqual(data.version);
      expect(savedOrder!.userId).toEqual(data.userId);
      expect(savedOrder!.status).toEqual(data.status);
      expect(savedOrder!.price).toEqual(data.ticket.price);
    });

    it('should acknowledge the message', async () => {
      const { listener, data, msg } = await setup();

      // Invoke onMessage
      await listener.onMessage(data, msg);

      // Check that the message was acknowledged
      expect(msg.ack).toHaveBeenCalled();
    });
  });

  describe('Order Cancelled Listener', () => {
    const setup = async () => {
      // Create an instance of the listener
      const listener = new OrderCancelledListener(natsClient.client);

      // Create a new order in the db
      const order = Order.build({
        id: mongoose.Types.ObjectId().toHexString(),
        status: OrderStatus.Created,
        price: 20,
        userId: 'fakeUserId',
        version: 0,
        quantity: 1,
      });
      await order.save();

      // Create the fake data event
      const data: OrderCancelledEvent['data'] = {
        id: order.id,
        version: order.version + 1,
        ticket: {
          id: 'ticketId',
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
        order,
      };
    };

    it('should change the order status to cancelled', async () => {
      const { listener, data, msg } = await setup();

      // Invoke onMessage
      await listener.onMessage(data, msg);

      // Fetch the order from the database
      const updatedOrder = await Order.findById(data.id);

      // Check that the order status is cancelled
      expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);
    });

    it('should acknowledge the message', async () => {
      const { listener, data, msg } = await setup();

      // Invoke onMessage
      await listener.onMessage(data, msg);

      // Check that the message was acknowledged
      expect(msg.ack).toHaveBeenCalled();
    });

    it('should throw an error and not acknowledge the message if order was not found', async () => {
      const { listener, data, msg } = await setup();

      // Change the order id to different id
      data.id = mongoose.Types.ObjectId().toHexString();

      // Invoke onMessage and expect it to throw error because the order was not found
      await expect(listener.onMessage(data, msg)).rejects.toThrow();

      // Check that the message was not acknowledged
      expect(msg.ack).not.toHaveBeenCalled();
    });
  });
});
