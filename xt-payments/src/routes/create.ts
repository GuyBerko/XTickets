import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import {
  requireAuth,
  validateRequest,
  BadRequestError,
  NotFoundError,
  NotAuthorizedError,
  OrderStatus,
} from '@gb-xtickets/common';
import { Order } from '../models/order';
import { stripe } from '../stripe';
import { Payment } from '../models/payments';
import { PaymentCreatedPublisher } from '../events/publishers';
import { natsClient } from '../nats-client';

const router = express.Router();

router.post(
  '/api/payments',
  requireAuth,
  [
    body('token').not().isEmpty().withMessage('Token is required'),
    body('orderId').not().isEmpty().withMessage('OrderId is required'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { token, orderId } = req.body;
    const order = await Order.findById(orderId);

    // If there is not order throw werror
    if (!order) {
      throw new NotFoundError(
        `[createChargeRouter] - order with id: ${orderId} not found`
      );
    }

    // If the user is not the order owner throw error
    if (order.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError(
        `[createChargeRouter] - user ${
          req.currentUser!.id
        } is not the owner of order with id: ${orderId}`
      );
    }

    // If the order status is cancelled throw error
    if (order.status === OrderStatus.Cancelled) {
      throw new BadRequestError(
        `[createChargeRouter] - order with id: ${orderId} is cancelled`
      );
    }

    // Create a new charge
    const chargeResponse = await stripe.charges.create({
      currency: 'usd',
      amount: Math.floor(order.price * order.quantity * 100),
      source: token,
    });

    // Crete and save a new payment
    const payment = Payment.build({
      orderId,
      stripeId: chargeResponse.id,
    });
    await payment.save();

    new PaymentCreatedPublisher(natsClient.client).publish({
      id: payment.id,
      orderId: payment.orderId,
      stripeId: payment.stripeId,
    });

    res.status(201).send({ success: true, payload: payment });
  }
);

export { router as createChargeRouter };
