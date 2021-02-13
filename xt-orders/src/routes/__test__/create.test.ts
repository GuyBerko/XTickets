import request from 'supertest';
import { app } from '../../app';
import { createTicket, getSignupCookie } from '../../test/helpers';
import { natsClient } from '../../nats-client';
import { Order, OrderStatus } from '../../models/order';
import mongoose from 'mongoose';

const EXPIRATION_WINDOW_SECONDS = 15 * 60;

describe('Create Order Route', () => {
  it('should listen for /api/orders for post requests', async () => {
    const response = await request(app).post('/api/orders').send({});
    expect(response.status).not.toEqual(404);
  });

  it('should block not registerd users', async () => {
    return request(app).post('/api/orders').send({}).expect(401);
  });

  it('should not block registerd users', async () => {
    const response = await request(app)
      .post('/api/orders')
      .set('Cookie', getSignupCookie())
      .send({});
    expect(response.status).not.toEqual(401);
  });

  it('should return error if an invalid ticketId is provided', async () => {
    return request(app)
      .post('/api/orders')
      .set('Cookie', getSignupCookie())
      .send({
        ticketId: '',
      })
      .expect(400);
  });

  it('should return error if ticket with ticketId was not found', async () => {
    const ticketId = mongoose.Types.ObjectId();
    return request(app)
      .post('/api/orders')
      .set('Cookie', getSignupCookie())
      .send({
        ticketId,
      })
      .expect(404);
  });

  it('should return error if ticket is reserved', async () => {
    const userId = 'abc123';
    // Build and Save a new ticket
    const ticket = await createTicket();

    // Create expiration date for the order
    const expiration = new Date();
    expiration.setSeconds(expiration.getSeconds() + EXPIRATION_WINDOW_SECONDS);

    // Build and Save a new order with this ticket so it will be marked as reserved
    const order = Order.build({
      ticket,
      userId,
      status: OrderStatus.Created,
      expiresAt: expiration,
    });
    await order.save();

    return request(app)
      .post('/api/orders')
      .set('Cookie', getSignupCookie(userId))
      .send({
        ticketId: ticket.id,
      })
      .expect(400);
  });

  it('should create new order', async () => {
    const userId = 'abc123';

    // Build and Save a new ticket
    const ticket = await createTicket();

    const result = await request(app)
      .post('/api/orders')
      .set('Cookie', getSignupCookie(userId))
      .send({
        ticketId: ticket.id,
      })
      .expect(201);

    expect(result.body.ticket.id).toEqual(ticket.id);
    expect(result.body.status).toEqual(OrderStatus.Created);
    expect(result.body.userId).toEqual(userId);
  });

  it('should emit create event', async () => {
    const userId = 'abc123';

    // Build and Save a new ticket
    const ticket = await createTicket();

    await request(app)
      .post('/api/orders')
      .set('Cookie', getSignupCookie(userId))
      .send({
        ticketId: ticket.id,
      })
      .expect(201);

    expect(natsClient.client.publish).toBeCalled();
  });
});
