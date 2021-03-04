import Queue from 'bull';
import { UserDoc } from '../models/user';
import { EmailSubjects, EmailTemplates, Mailer } from '../utils/mailer';

interface Payload {
  user: UserDoc;
}

const userCreatedQueue = new Queue<Payload>('user:created', {
  redis: {
    host: process.env.REDIS_HOST,
  },
});

userCreatedQueue.process(async (job) => {
  const { user } = job.data;
  await sendEmail(user);
});

const sendEmail = async (user: UserDoc) => {
  // Initialized the email data
  // User date
  const { email, name } = user;

  // Set the email subject to UserCreated
  const subject = EmailSubjects.UserCreated;

  // Set the email template to UserCreated
  const template = EmailTemplates.UserCreated;

  // Setup the template params
  const templateParams = {
    name,
  };

  // Create mailer instance
  const mailer = new Mailer(email, name, subject, template, templateParams);

  // Send the email
  try {
    await mailer.send();
  } catch (error) {
    console.error(error);

    if (error.response) {
      console.error(error.response.body);
    }
  }
};

export { userCreatedQueue };
