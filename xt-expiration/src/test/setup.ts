jest.mock('../nats-client');

beforeAll(async () => {
  process.env.JWT_KEY = 'abc123';

  jest.clearAllMocks();
  jest.clearAllTimers();
});

afterEach(() => {
  jest.clearAllMocks();
  jest.clearAllTimers();
});
