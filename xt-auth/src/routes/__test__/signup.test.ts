import request from 'supertest';
import { app } from '../../app';

describe('SignUp Route', () => {
  it('should return 201 on successful signup', async () => {
    return request(app)
      .post('/api/users/signup')
      .send({
        email: 'test@test.com',
        password: 'password',
        name: 'testname',
      })
      .expect(201);
  });

  it('should return 400 if email not valid', async () => {
    return request(app)
      .post('/api/users/signup')
      .send({
        email: 'aUnValidEmail',
        password: 'password',
        name: 'testname',
      })
      .expect(400);
  });

  it('should return 400 if password not valid', async () => {
    return request(app)
      .post('/api/users/signup')
      .send({
        email: 'test@test.com',
        password: 'p',
        name: 'testname',
      })
      .expect(400);
  });

  it('should return 400 if password or email is missing', async () => {
    await request(app)
      .post('/api/users/signup')
      .send({
        email: 'test@test.com',
        name: 'testname',
      })
      .expect(400);

    return request(app)
      .post('/api/users/signup')
      .send({
        password: 'p123456',
        name: 'testname',
      })
      .expect(400);
  });

  it('should not allowed duplicate emails', async () => {
    await request(app)
      .post('/api/users/signup')
      .send({
        email: 'test@test.com',
        password: 'password',
        name: 'testname',
      })
      .expect(201);

    return request(app)
      .post('/api/users/signup')
      .send({
        email: 'test@test.com',
        password: 'password',
        name: 'testname',
      })
      .expect(400);
  });

  it('should set a cookie after successful signup', async () => {
    const response = await request(app)
      .post('/api/users/signup')
      .send({
        email: 'test@test.com',
        password: 'password',
        name: 'testname',
      })
      .expect(201);

    expect(response.get('Set-Cookie')).toBeDefined();
  });
});
