import request from 'supertest';
import { app } from '../../app';
import { getSignupCookie } from '../../test/helpers';
import { Ticket } from '../../models/ticket';
import { natsClient } from '../../nats-client';
import { TicketCategory } from '@gb-xtickets/common';

const setup = ({
  title = 'concert',
  price = 10,
  description = 'desc',
  category = TicketCategory.Comedy,
  date = new Date().getTime(),
} = {}) => ({
  title,
  price,
  description,
  category,
  date,
});

describe('Create Tickets Route', () => {
  it('should listen for /api/tickets for post requests', async () => {
    const response = await request(app).post('/api/tickets').send({});
    expect(response.status).not.toEqual(404);
  });

  it('should block not registerd users', async () => {
    return request(app).post('/api/tickets').send({}).expect(401);
  });

  it('should not block registerd users', async () => {
    const response = await request(app)
      .post('/api/tickets')
      .set('Cookie', getSignupCookie())
      .send({});
    expect(response.status).not.toEqual(401);
  });

  it('should return error if an invalid title is provided', async () => {
    return request(app)
      .post('/api/tickets')
      .set('Cookie', getSignupCookie())
      .send(setup({ title: '' }))
      .expect(400);
  });

  it('should return error if an invalid category is provided', async () => {
    const params = setup();
    //@ts-ignore
    params.category = 'fakeCategory';
    return request(app)
      .post('/api/tickets')
      .set('Cookie', getSignupCookie())
      .send(params)
      .expect(400);
  });

  it('should returns an error if invalid price is provided', async () => {
    // negative price
    await request(app)
      .post('/api/tickets')
      .set('Cookie', getSignupCookie())
      .send(setup({ price: -10 }))
      .expect(400);

    // undefined price
    const params = setup();
    //@ts-ignore
    params.price = undefined;
    return request(app)
      .post('/api/tickets')
      .set('Cookie', getSignupCookie())
      .send(params)
      .expect(400);
  });

  it('should should create ticket if the params are valid', async () => {
    let tickets = await Ticket.find({});
    expect(tickets.length).toEqual(0);

    const params = setup();

    await request(app)
      .post('/api/tickets')
      .set('Cookie', getSignupCookie())
      .send(params)
      .expect(201);

    tickets = await Ticket.find({});
    expect(tickets.length).toEqual(1);
    expect(tickets[0].title).toEqual(params.title);
    expect(tickets[0].price).toEqual(params.price);
  });

  it('should publish event', async () => {
    const params = setup();

    await request(app)
      .post('/api/tickets')
      .set('Cookie', getSignupCookie())
      .send(params)
      .expect(201);

    expect(natsClient.client.publish).toBeCalled();
  });
});
