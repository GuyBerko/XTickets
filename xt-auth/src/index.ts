import mongoose from 'mongoose';
import { app } from './app';

const envVariables = ['JWT_KEY', 'MONGO_URI'];
const PORT = process.env.PORT || 3000;

// Server startup
(async () => {
  // Verify that all env variables are defined
  for (const envVariable of envVariables) {
    if (!process.env[envVariable]) {
      throw new Error(`${envVariable} is not defined`);
    }
  }

  try {
    await mongoose.connect(process.env.MONGO_URI!, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    });
  } catch (err) {
    console.error(err);
  }

  app.listen(PORT, () => {
    console.log(`Auth listening on ${PORT}`);
  });
})();
