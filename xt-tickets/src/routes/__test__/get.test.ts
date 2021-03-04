import request from 'supertest';
import { app } from '../../app';
import { getSignupCookie } from '../../test/helpers';
import mongoose from 'mongoose';
import { TicketCategory } from '@gb-xtickets/common';

describe('Get Ticket Route', () => {
  it('should return 404 if the ticket was not found', async () => {
    const id = new mongoose.Types.ObjectId().toHexString();
    await request(app).get(`/api/tickets/${id}`).send().expect(404);
  });

  it('should return the ticket if he was found', async () => {
    const params = {
      title: 'concert',
      price: 10,
      description: 'desc',
      category: TicketCategory.Comedy,
      date: new Date(),
    };

    const response = await request(app)
      .post('/api/tickets')
      .set('Cookie', getSignupCookie())
      .send(params)
      .expect(201);

    const ticketResponse = await request(app)
      .get(`/api/tickets/${response.body.id}`)
      .send()
      .expect(200);

    expect(ticketResponse.body.title).toEqual(params.title);
    expect(ticketResponse.body.price).toEqual(params.price);
    expect(ticketResponse.body.description).toEqual(params.description);
    expect(ticketResponse.body.category).toEqual(params.category);
    expect(ticketResponse.body.date).toEqual(params.date.toISOString());
  });
});
