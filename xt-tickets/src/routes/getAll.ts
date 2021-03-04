import express, { Request, Response } from 'express';
import { Ticket } from '../models/ticket';
import { TicketCategory } from '@gb-xtickets/common';

const router = express.Router();

router.get('/api/tickets', async (req: Request, res: Response) => {
  const tickets = await Ticket.find({
    orderId: undefined,
  });

  let sortedTickets: any = {};

  Object.keys(TicketCategory).map((category) => (sortedTickets[category] = []));

  tickets.forEach((ticket) => sortedTickets[ticket.category]?.push(ticket));

  res.status(200).send(sortedTickets);
});

export { router as getAllTicketsRouter };
