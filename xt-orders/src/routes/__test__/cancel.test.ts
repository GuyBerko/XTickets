import request from 'supertest';
import { app } from '../../app';
import { getSignupCookie, createTicket } from '../../test/helpers';
import mongoose from 'mongoose';
import { Order, OrderStatus } from '../../models/order';
import { natsClient } from '../../nats-client';

describe('Cancel Route', () => {
  it('should block not registerd users', async () => {
    const orderId = mongoose.Types.ObjectId();
    return request(app).put(`/api/orders/${orderId}`).send().expect(401);
  });

  it('should not block registerd users', async () => {
    const orderId = mongoose.Types.ObjectId();
    const response = await request(app)
      .put(`/api/orders/${orderId}`)
      .set('Cookie', getSignupCookie())
      .send();
    expect(response.status).not.toEqual(401);
  });

  it('should return error if order was not found', async () => {
    const orderId = mongoose.Types.ObjectId();
    return request(app)
      .put(`/api/orders/${orderId}`)
      .set('Cookie', getSignupCookie())
      .send()
      .expect(404);
  });

  it('should return error if the order is owned by another user', async () => {
    const userOneCookie = getSignupCookie('abc123');
    const userTwoCookie = getSignupCookie('def456');

    // Build and Save a new ticket
    const ticket = await createTicket();

    const {
      body: { id: orderId },
    } = await request(app)
      .post('/api/orders')
      .set('Cookie', userOneCookie)
      .send({
        ticketId: ticket.id,
      })
      .expect(201);

    return request(app)
      .put(`/api/orders/${orderId}`)
      .set('Cookie', userTwoCookie)
      .send()
      .expect(401);
  });

  it('should cancel the order', async () => {
    const userId = 'abc123';
    const userCookie = getSignupCookie(userId);

    const ticket = await createTicket();

    const {
      body: { id: orderId },
    } = await request(app)
      .post('/api/orders')
      .set('Cookie', userCookie)
      .send({
        ticketId: ticket.id,
      })
      .expect(201);

    const order = await Order.findById(orderId);
    expect(order).not.toEqual(null);
    expect(order!.status).toEqual(OrderStatus.Created);

    await request(app)
      .put(`/api/orders/${orderId}`)
      .set('Cookie', userCookie)
      .send()
      .expect(202);

    const updatedOrder = await Order.findById(orderId);
    expect(updatedOrder).not.toEqual(null);
    expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);
  });

  it('should emit cancel event', async () => {
    const userId = 'abc123';
    const userCookie = getSignupCookie(userId);

    const ticket = await createTicket();

    // Create order
    const {
      body: { id: orderId },
    } = await request(app)
      .post('/api/orders')
      .set('Cookie', userCookie)
      .send({
        ticketId: ticket.id,
      })
      .expect(201);

    // Cancel the order
    await request(app)
      .put(`/api/orders/${orderId}`)
      .set('Cookie', userCookie)
      .send()
      .expect(202);

    expect(natsClient.client.publish).toBeCalled();
  });
});
