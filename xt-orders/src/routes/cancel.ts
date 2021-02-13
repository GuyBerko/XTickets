import {
  NotAuthorizedError,
  NotFoundError,
  OrderStatus,
  requireAuth,
} from '@gb-xtickets/common';
import express, { Request, Response } from 'express';
import { Order } from '../models/order';
import { OrderCancelledPublisher } from '../events/publishers';
import { natsClient } from '../nats-client';

const router = express.Router();

router.put(
  '/api/orders/:orderId',
  requireAuth,
  async (req: Request, res: Response) => {
    const { orderId } = req.params;

    const order = await Order.findById(orderId).populate('ticket');

    if (!order) {
      throw new NotFoundError(`Order with id: ${orderId} not found`);
    }

    if (order.userId != req.currentUser!.id) {
      throw new NotAuthorizedError();
    }

    order.set({
      expiresAt: null,
      status: OrderStatus.Cancelled,
    });

    await order.save();

    new OrderCancelledPublisher(natsClient.client).publish({
      id: order.id,
      version: order.version,
      ticket: {
        id: order.ticket.id,
      },
    });

    res.status(202).send(order);
  }
);

export { router as cancelOrderRouter };
