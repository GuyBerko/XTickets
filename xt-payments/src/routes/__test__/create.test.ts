import request from 'supertest';
import { app } from '../../app';
import { getSignupCookie } from '../../test/helpers';
import { Order, OrderStatus } from '../../models/order';
import mongoose from 'mongoose';
import { stripe } from '../../stripe';
import { Payment } from '../../models/payments';
import { natsClient } from '../../nats-client';

describe('Create Payment Charge Route', () => {
  it('should listen for /api/payments for post requests', async () => {
    const response = await request(app).post('/api/payments').send({});
    expect(response.status).not.toEqual(404);
  });

  it('should block not registerd users', async () => {
    return request(app).post('/api/payments').send({}).expect(401);
  });

  it('should not block registerd users', async () => {
    const response = await request(app)
      .post('/api/payments')
      .set('Cookie', getSignupCookie())
      .send({});
    expect(response.status).not.toEqual(401);
  });

  it('should return error if an invalid token is provided', async () => {
    return request(app)
      .post('/api/payments')
      .set('Cookie', getSignupCookie())
      .send({
        token: '',
        orderId: 'abc123',
      })
      .expect(400);
  });

  it('should returns an error if invalid orderId is provided', async () => {
    await request(app)
      .post('/api/payments')
      .set('Cookie', getSignupCookie())
      .send({
        token: 'abc123',
        orderId: '',
      })
      .expect(400);
  });

  it('should returns an error if order was not found', async () => {
    await request(app)
      .post('/api/payments')
      .set('Cookie', getSignupCookie())
      .send({
        token: 'abc123',
        orderId: mongoose.Types.ObjectId().toHexString(),
      })
      .expect(404);
  });

  it('should returns an error if current user is not the order owner', async () => {
    const order = Order.build({
      id: mongoose.Types.ObjectId().toHexString(),
      status: OrderStatus.Created,
      userId: mongoose.Types.ObjectId().toHexString(),
      price: 20,
      version: 1,
    });

    await order.save();

    await request(app)
      .post('/api/payments')
      .set('Cookie', getSignupCookie())
      .send({
        token: 'abc123',
        orderId: order.id,
      })
      .expect(401);
  });

  it('should returns an error if order is cancelled', async () => {
    const order = Order.build({
      id: mongoose.Types.ObjectId().toHexString(),
      status: OrderStatus.Cancelled,
      userId: mongoose.Types.ObjectId().toHexString(),
      price: 20,
      version: 1,
    });

    await order.save();

    await request(app)
      .post('/api/payments')
      .set('Cookie', getSignupCookie(order.userId))
      .send({
        token: 'abc123',
        orderId: order.id,
      })
      .expect(400);
  });

  it('should return 201 when inputs are valid', async () => {
    const order = Order.build({
      id: mongoose.Types.ObjectId().toHexString(),
      status: OrderStatus.Created,
      userId: mongoose.Types.ObjectId().toHexString(),
      price: 20,
      version: 1,
    });

    await order.save();

    await request(app)
      .post('/api/payments')
      .set('Cookie', getSignupCookie(order.userId))
      .send({
        token: 'abc123',
        orderId: order.id,
      })
      .expect(201);

    const mockCallArgs = (stripe.charges.create as jest.Mock).mock.calls[0];
    expect(mockCallArgs[0]).toEqual({
      currency: 'usd',
      amount: order.price * 100,
      source: 'abc123',
    });
  });

  it('should create new payment record', async () => {
    const order = Order.build({
      id: mongoose.Types.ObjectId().toHexString(),
      status: OrderStatus.Created,
      userId: mongoose.Types.ObjectId().toHexString(),
      price: 20,
      version: 1,
    });

    await order.save();

    await request(app)
      .post('/api/payments')
      .set('Cookie', getSignupCookie(order.userId))
      .send({
        token: 'abc123',
        orderId: order.id,
      })
      .expect(201);

    const payment = await Payment.findOne({ orderId: order.id });
    expect(payment).not.toEqual(null);
  });

  it('should emit payment created event', async () => {
    const order = Order.build({
      id: mongoose.Types.ObjectId().toHexString(),
      status: OrderStatus.Created,
      userId: mongoose.Types.ObjectId().toHexString(),
      price: 20,
      version: 1,
    });

    await order.save();

    await request(app)
      .post('/api/payments')
      .set('Cookie', getSignupCookie(order.userId))
      .send({
        token: 'abc123',
        orderId: order.id,
      })
      .expect(201);

    expect(natsClient.client.publish).toBeCalled();
  });
});
