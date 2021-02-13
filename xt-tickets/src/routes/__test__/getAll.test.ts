import request from 'supertest';
import { app } from '../../app';
import { getSignupCookie } from '../../test/helpers';

describe('Get All Tickets Route', () => {
  it('should return the ticket if he was found', async () => {
    const tickets = [
      {
        title: 'concert1',
        price: 10,
      },
      {
        title: 'concert2',
        price: 20,
      },
      {
        title: 'concert3',
        price: 30,
      },
    ];

    for (const ticket of tickets) {
      await request(app)
        .post('/api/tickets')
        .set('Cookie', getSignupCookie())
        .send(ticket)
        .expect(201);
    }

    const ticketsResponse = await request(app)
      .get('/api/tickets')
      .send()
      .expect(200);

    for (const [index, ticket] of ticketsResponse.body.entries()) {
      expect(ticket.title).toEqual(tickets[index].title);
      expect(ticket.price).toEqual(tickets[index].price);
    }
  });
});
