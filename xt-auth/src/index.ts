import mongoose from 'mongoose';
import { app } from './app';
import { natsClient } from './nats-client';

const envVariables = [
  'JWT_KEY',
  'MONGO_URI',
  'NATS_CLUSTER_ID',
  'NATS_URL',
  'NATS_CLIENT_ID',
];
const PORT = process.env.PORT || 3000;

// Server startup
(async () => {
  // Verify that all env variables are defined
  for (const envVariable of envVariables) {
    if (!process.env[envVariable]) {
      throw new Error(`${envVariable} is not defined`);
    }
  }

  // Connect to nats streaming server (the event bus)
  await natsClient.connect(
    process.env.NATS_CLUSTER_ID!,
    process.env.NATS_CLIENT_ID!,
    process.env.NATS_URL!
  );

  // If nats connection was closed kill the proccess
  natsClient.client.on('close', () => {
    console.log('NATS connection closed!');
    process.exit();
  });

  // When the process get interrupted close nats client
  process.on('SIGINT', () => natsClient.client.close());
  process.on('SIGTERM', () => natsClient.client.close());

  // NOTE: check if this is possible to turn this to strategy to allow easier db decoupling
  await mongoose.connect(process.env.MONGO_URI!, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  });

  app.listen(PORT, () => {
    console.log(`Auth listening on ${PORT}`);
  });
})();
