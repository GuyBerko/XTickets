import request from 'supertest';
import { app } from '../../app';
import { TicketCategory } from '@gb-xtickets/common';

describe('Get All Ticket Categories Route', () => {
  it('should return the ticket categories', async () => {
    const response = await request(app)
      .get('/api/categories')
      .send()
      .expect(200);

    expect(response.body).toEqual(Object.values(TicketCategory));
  });
});
