import {
  NotAuthorizedError,
  NotFoundError,
  requireAuth,
} from '@gb-xtickets/common';
import express, { Request, Response } from 'express';
import { Order } from '../models/order';

const router = express.Router();

router.get(
  '/api/orders/:orderId',
  requireAuth,
  async (req: Request, res: Response) => {
    const { orderId } = req.params;

    const order = await Order.findById(orderId).populate('ticket');

    if (!order) {
      throw new NotFoundError(
        `[Get-Route] - order with id: ${orderId} not found`
      );
    }

    if (order.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError(
        `[Get-Route] - User with id: ${req.currentUser!.id} not authorized`
      );
    }

    res.send(order);
  }
);

export { router as getOrderRouter };
