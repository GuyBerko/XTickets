import request from 'supertest';
import { app } from '../../app';
import { getSignupCookie, createTicket } from '../../test/helpers';
import mongoose from 'mongoose';

describe('Get Route', () => {
  it('should block not registerd users', async () => {
    const orderId = mongoose.Types.ObjectId();
    return request(app).get(`/api/orders/${orderId}`).send({}).expect(401);
  });

  it('should not block registerd users', async () => {
    const orderId = mongoose.Types.ObjectId();
    const response = await request(app)
      .get(`/api/orders/${orderId}`)
      .set('Cookie', getSignupCookie())
      .send();
    expect(response.status).not.toEqual(401);
  });

  it('should return error if order was not found', async () => {
    const orderId = mongoose.Types.ObjectId();
    return request(app)
      .get(`/api/orders/${orderId}`)
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
      .get(`/api/orders/${orderId}`)
      .set('Cookie', userTwoCookie)
      .send()
      .expect(401);
  });

  it('should return the user order', async () => {
    const userId = 'abc123';
    const userCookie = getSignupCookie(userId);

    // Build and Save a new ticket
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

    const order = await request(app)
      .get(`/api/orders/${orderId}`)
      .set('Cookie', userCookie)
      .send()
      .expect(200);

    expect(order.body.ticket.id).toEqual(ticket.id);
    expect(order.body.userId).toEqual(userId);
  });
});
