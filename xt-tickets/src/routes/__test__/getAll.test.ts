import request from 'supertest';
import { app } from '../../app';
import { getSignupCookie } from '../../test/helpers';
import { TicketCategory } from '@gb-xtickets/common';

describe('Get All Tickets Route', () => {
  it('should return the ticket if he was found', async () => {
    const tickets = [
      {
        title: 'concert1',
        price: 10,
        description: 'desc',
        category: TicketCategory.Comedy,
        date: new Date(),
      },
      {
        title: 'concert2',
        price: 20,
        description: 'desc',
        category: TicketCategory.Comedy,
        date: new Date(),
      },
      {
        title: 'concert3',
        price: 30,
        description: 'desc',
        category: TicketCategory.Comedy,
        date: new Date(),
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

    expect(ticketsResponse.body[TicketCategory.Comedy].length).toEqual(3);
    for (const [index, ticket] of ticketsResponse.body[
      TicketCategory.Comedy
    ].entries()) {
      expect(ticket.title).toEqual(tickets[index].title);
      expect(ticket.price).toEqual(tickets[index].price);
      expect(ticket.description).toEqual(tickets[index].description);
      expect(ticket.category).toEqual(tickets[index].category);
      expect(ticket.date.toISOString()).toEqual(tickets[index].date);
    }
  });
});
