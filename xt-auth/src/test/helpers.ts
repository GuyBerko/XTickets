import request from 'supertest';
import { app } from '../app';

export const noop = () => {};

export const signup = async (
  email: string = 'test@test.com',
  password: string = 'password',
  name = 'testname'
): Promise<string[]> => {
  const response = await request(app)
    .post('/api/users/signup')
    .send({ email, password, name })
    .expect(201);

  const cookie = response.get('Set-Cookie');
  return cookie;
};
