import request from 'supertest';
import { app } from '../../app';
import { getSignupCookie, createTicket } from '../../test/helpers';

describe('GetAll Route', () => {
  it('should listen for /api/orders for get requests', async () => {
    const response = await request(app).get('/api/orders').send({});
    expect(response.status).not.toEqual(404);
  });

  it('should return all user orders', async () => {
    // Create three tickets
    const ticketOne = await createTicket('Concert 1');
    const ticketTwo = await createTicket('Concert 2');
    const ticketThree = await createTicket('Concert 3');

    // Create two users
    const userOne = getSignupCookie('abc123');
    const userTwoId = 'def456';
    const userTwo = getSignupCookie(userTwoId);

    // Create one order as User #1
    await request(app)
      .post('/api/orders')
      .set('Cookie', userOne)
      .send({
        ticketId: ticketOne.id,
      })
      .expect(201);

    // Create two oreders as User #2
    await request(app)
      .post('/api/orders')
      .set('Cookie', userTwo)
      .send({
        ticketId: ticketTwo.id,
      })
      .expect(201);

    await request(app)
      .post('/api/orders')
      .set('Cookie', userTwo)
      .send({
        ticketId: ticketThree.id,
      })
      .expect(201);

    // Make request to get orders for User #2
    const result = await request(app)
      .get('/api/orders')
      .set('Cookie', userTwo)
      .send();

    // Make sure we only got the orders for User #2
    expect(result.body.length).toEqual(2);
    expect(result.body[0].ticket.id).toEqual(ticketTwo.id);
    expect(result.body[0].userId).toEqual(userTwoId);
    expect(result.body[1].ticket.id).toEqual(ticketThree.id);
    expect(result.body[1].userId).toEqual(userTwoId);
  });
});
