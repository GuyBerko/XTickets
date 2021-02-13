import request from 'supertest';
import { app } from '../app';
import jwt from 'jsonwebtoken';

export const noop = () => {};

export const getSignupCookie = (
  id: string = 'abc123',
  email: string = 'test@test.com'
): string[] => {
  const payload = {
    id,
    email,
  };

  const token = jwt.sign(payload, process.env.JWT_KEY!);

  // Build session Object. { jwt: MY_JWT }
  const session = { jwt: token };

  // Turn that session into JSON
  const sessionJSON = JSON.stringify(session);

  // Take JSON and encode it as base64
  const base64 = Buffer.from(sessionJSON).toString('base64');

  // return a string thats the cookie with the encoded data
  return [`express:sess=${base64}`];
};
