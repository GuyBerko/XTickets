import jwt from 'jsonwebtoken';
import { Ticket, TicketDoc } from '../models/ticket';
import mongoose from 'mongoose';

export const noop = () => {};

export const getSignupCookie = (
  id: string = '1',
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

export const createTicket = async (
  title: string = 'Concert',
  price: number = 30,
  id: string = mongoose.Types.ObjectId().toHexString(),
  date: Date = new Date()
): Promise<TicketDoc> => {
  // Build and Save a new ticket
  const ticket = Ticket.build({
    title,
    price,
    id,
    date,
  });
  await ticket.save();
  return ticket;
};
