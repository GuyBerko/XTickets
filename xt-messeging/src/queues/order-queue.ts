import Queue from 'bull';
import { OrderDoc } from '../models/order';
import { TicketDoc } from '../models/ticket';
import { UserDoc } from '../models/user';
import { EmailSubjects, EmailTemplates, Mailer } from '../utils/mailer';

export enum OrderQueueTypes {
  'OrderCompleted' = 'order:completed',
  'OrderRemainder' = 'order:remainder',
}

export const jobsRemainderMap: { [key: string]: number | string } = {};

interface Payload {
  order: OrderDoc;
  user: UserDoc;
  ticket: TicketDoc;
  type: OrderQueueTypes;
}

const orderQueue = new Queue<Payload>('order', {
  redis: {
    host: process.env.REDIS_HOST,
  },
});

orderQueue.process(async (job) => {
  const { order, user, ticket, type } = job.data;
  switch (type) {
    case OrderQueueTypes.OrderCompleted: {
      await sendEmail(
        order,
        ticket,
        user,
        EmailSubjects.OrderComplete,
        EmailTemplates.OrderComplete
      );
      removeReminderJob(order.id);
      break;
    }
    case OrderQueueTypes.OrderRemainder: {
      await sendEmail(
        order,
        ticket,
        user,
        EmailSubjects.OrderRemainder,
        EmailTemplates.OrderRemainder
      );
      removeReminderJob(order.id);
      break;
    }
    default: {
      console.log(`[orderQueue] - type: ${type} is not supported`);
    }
  }
});

const removeReminderJob = (orderId: string) => {
  const jobId = jobsRemainderMap[orderId];
  if (!jobId) return;
  orderQueue.getJob(jobId).then((job) => {
    if (job) {
      job.remove();
    }

    delete jobsRemainderMap[orderId];
  });
};

const sendEmail = async (
  order: OrderDoc,
  ticket: TicketDoc,
  user: UserDoc,
  subject: EmailSubjects,
  template: EmailTemplates
) => {
  // Initialized the email data
  // User date
  const { email, name } = user;

  // Order Data
  const orderDate = new Date(order.createdAt).toDateString();
  const quantity = order.quantity;
  const orderId = order.id;

  // Event Data
  const eventName = ticket.title;
  const eventDate = new Date(ticket.date).toDateString();
  const eventDesc = ticket.description;
  const price = ticket.price;
  const priceWithoutTax = price - price * order.tax;
  const tax = price * order.tax;
  const totalPrice = priceWithoutTax + tax;

  // Setup the template params
  const templateParams = {
    orderId,
    email,
    name,
    eventName,
    eventDesc,
    eventDate,
    price: price.toFixed(2),
    priceWithoutTax: priceWithoutTax.toFixed(2),
    tax: tax.toFixed(2),
    totalPrice: totalPrice.toFixed(2),
    orderDate,
    quantity,
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

export { orderQueue };
