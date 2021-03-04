import { natsClient } from './nats-client';
import mongoose from 'mongoose';
import {
  OrderCreatedListener,
  PaymentCreatedListener,
  TicketCreatedListener,
  TicketUpdatedListener,
  UserCreatedListener,
} from './events/listeners';
import client from '@sendgrid/mail';

const envVariables = [
  'NATS_CLUSTER_ID',
  'NATS_URL',
  'NATS_CLIENT_ID',
  'MONGO_URI',
  'SENDGRID_API_KEY',
];

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

  // Connect to mongodb
  await mongoose.connect(process.env.MONGO_URI!, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  });

  client.setApiKey(process.env.SENDGRID_API_KEY!);

  // Create event listeners
  new OrderCreatedListener(natsClient.client).listen();
  new PaymentCreatedListener(natsClient.client).listen();
  new TicketCreatedListener(natsClient.client).listen();
  new TicketUpdatedListener(natsClient.client).listen();
  new UserCreatedListener(natsClient.client).listen();
})();
