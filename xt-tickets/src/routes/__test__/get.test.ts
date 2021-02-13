import request from 'supertest';
import { app } from '../../app';
import { getSignupCookie } from '../../test/helpers';
import mongoose from 'mongoose';

describe('Get Ticket Route', () => {
  it('should return 404 if the ticket was not found', async () => {
    const id = new mongoose.Types.ObjectId().toHexString();
    await request(app).get(`/api/tickets/${id}`).send().expect(404);
  });

  it('should return the ticket if he was found', async () => {
    const params = {
      title: 'concert',
      price: 10,
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
  });
});
