import request from 'supertest';
import { app } from '../../app';

describe('SignIn Route', () => {
  it('should return 201 on successful signin', async () => {
    await request(app)
      .post('/api/users/signup')
      .send({
        email: 'test@test.com',
        password: 'password',
      })
      .expect(201);

    return request(app)
      .post('/api/users/signin')
      .send({
        email: 'test@test.com',
        password: 'password',
      })
      .expect(200);
  });

  it('should return 400 on signin with non exist email', async () => {
    return request(app)
      .post('/api/users/signin')
      .send({
        email: 'test@test.com',
        password: 'password',
      })
      .expect(400);
  });

  it('should return 400 if email not valid', async () => {
    return request(app)
      .post('/api/users/signin')
      .send({
        email: 'aUnValidEmail',
        password: 'password',
      })
      .expect(400);
  });

  it('should return 400 if password not valid', async () => {
    return request(app)
      .post('/api/users/signin')
      .send({
        email: 'test@test.com',
        password: '',
      })
      .expect(400);
  });

  it('should return 400 if password or email is missing', async () => {
    await request(app)
      .post('/api/users/signin')
      .send({
        email: 'test@test.com',
      })
      .expect(400);

    return request(app)
      .post('/api/users/signin')
      .send({
        password: 'p123456',
      })
      .expect(400);
  });

  it('should return 400 if password does not match to stored password', async () => {
    await request(app)
      .post('/api/users/signup')
      .send({
        email: 'test@test.com',
        password: 'p123456',
      })
      .expect(201);

    return request(app)
      .post('/api/users/signin')
      .send({
        email: 'test@test.com',
        password: 'p12345',
      })
      .expect(400);
  });

  it('should set a cookie after successful signin', async () => {
    await request(app)
      .post('/api/users/signup')
      .send({
        email: 'test@test.com',
        password: 'password',
      })
      .expect(201);

    const response = await request(app)
      .post('/api/users/signin')
      .send({
        email: 'test@test.com',
        password: 'password',
      })
      .expect(200);

    expect(response.get('Set-Cookie')).toBeDefined();
  });
});
