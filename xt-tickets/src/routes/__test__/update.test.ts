import request from 'supertest';
import { app } from '../../app';
import { getSignupCookie, createTicket } from '../../test/helpers';
import mongoose from 'mongoose';
import { natsClient } from '../../nats-client';
import { Ticket } from '../../models/ticket';

const setup = ({ title = 'concert', price = 10 } = {}) => ({
  title,
  price,
});

describe('Create Tickets Route', () => {
  it('should return 404 if the provided id not exists', async () => {
    const id = new mongoose.Types.ObjectId().toHexString();
    return request(app)
      .put(`/api/tickets/${id}`)
      .set('Cookie', getSignupCookie())
      .send({
        title: 'my ticket title',
        price: 10,
      })
      .expect(404);
  });

  it('should rturn 401 if the user is not authenticated', async () => {
    const response = await createTicket(setup());

    return request(app)
      .put(`/api/tickets/${response.body.id}`)
      .send({
        title: 'my ticket title',
        price: 15,
      })
      .expect(401);
  });

  it('should rturn 401 if the user does not own the ticket', async () => {
    const response = await createTicket(setup());

    return request(app)
      .put(`/api/tickets/${response.body.id}`)
      .set('Cookie', getSignupCookie(2, 'different@email.com'))
      .send({
        title: 'my ticket title',
        price: 15,
      })
      .expect(401);
  });

  it('should rturn 400 if the user provide invalid title', async () => {
    const response = await createTicket(setup());

    return request(app)
      .put(`/api/tickets/${response.body.id}`)
      .set('Cookie', getSignupCookie())
      .send({
        title: '',
        price: 15,
      })
      .expect(400);
  });

  it('should rturn 400 if the user provide invalid price', async () => {
    const response = await createTicket(setup());

    return request(app)
      .put(`/api/tickets/${response.body.id}`)
      .set('Cookie', getSignupCookie())
      .send({
        title: 'concert',
        price: -5,
      })
      .expect(400);
  });

  it('should rturn 400 if the ticket is reserved', async () => {
    const {
      body: { id },
    } = await createTicket(setup());

    const ticket = await Ticket.findById(id);
    ticket!.set({ orderId: mongoose.Types.ObjectId().toHexString() });
    await ticket!.save();

    return request(app)
      .put(`/api/tickets/${id}`)
      .set('Cookie', getSignupCookie())
      .send({
        title: 'concert',
        price: 15,
      })
      .expect(400);
  });

  it('should update ticket if the params are valid', async () => {
    const response = await createTicket(setup());
    const params = {
      title: 'concert',
      price: 25,
    };

    await request(app)
      .put(`/api/tickets/${response.body.id}`)
      .set('Cookie', getSignupCookie())
      .send(params)
      .expect(200);

    const ticketResponse = await request(app)
      .get(`/api/tickets/${response.body.id}`)
      .send()
      .expect(200);

    expect(ticketResponse.body.title).toEqual(params.title);
    expect(ticketResponse.body.price).toEqual(params.price);
  });

  it('should publish event', async () => {
    const params = {
      title: 'gdfsgsdg',
      price: 10,
    };

    await request(app)
      .post('/api/tickets')
      .set('Cookie', getSignupCookie())
      .send(params)
      .expect(201);

    expect(natsClient.client.publish).toBeCalled();
  });
});
