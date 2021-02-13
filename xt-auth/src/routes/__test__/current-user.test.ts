import request from 'supertest';
import { app } from '../../app';
import { signup } from '../../test/helpers';

describe('Current User Route', () => {
  it('should response with details about the current user', async () => {
    const cookie = await signup('test@test.com');

    const response = await request(app)
      .get('/api/users/currentuser')
      .set('Cookie', cookie)
      .send()
      .expect(200);

    expect(response.body.currentUser.email).toEqual('test@test.com');
  });

  it('should response with null if not authenticated', async () => {
    const response = await request(app)
      .get('/api/users/currentuser')
      .send()
      .expect(200);

    expect(response.body.currentUser).toEqual(null);
  });
});
