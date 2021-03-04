import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import {
  requireAuth,
  validateRequest,
  TicketCategory,
} from '@gb-xtickets/common';
import { Ticket } from '../models/ticket';
import { TicketCreatedPublisher } from '../events/publishers';
import { natsClient } from '../nats-client';

const router = express.Router();

router.post(
  '/api/tickets',
  requireAuth,
  [
    body('title').not().isEmpty().withMessage('Title is required'),
    body('category')
      .isIn(Object.values(TicketCategory))
      .withMessage('Category is required'),
    body('date').not().isEmpty().withMessage('Date is required'),
    body('price')
      .isFloat({ gt: 0 })
      .withMessage('Price must be greater then zero'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { title, price, category, description, date } = req.body;

    const ticket = Ticket.build({
      title,
      price,
      category,
      description,
      image: '', // TODO: add image url from client
      userId: req.currentUser!.id,
      date: new Date(date),
    });

    await ticket.save();

    await new TicketCreatedPublisher(natsClient.client).publish({
      id: ticket.id,
      title: ticket.title,
      price: ticket.price,
      userId: ticket.userId,
      version: ticket.version,
      category: ticket.category,
      date: ticket.date,
      description: ticket.description,
    });

    res.status(201).send(ticket);
  }
);

export { router as createTicketRouter };
