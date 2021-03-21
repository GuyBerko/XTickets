import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import {
  requireAuth,
  validateRequest,
  TicketCategory,
  BadRequestError,
} from '@gb-xtickets/common';
import { Ticket } from '../models/ticket';
import { TicketCreatedPublisher } from '../events/publishers';
import { natsClient } from '../nats-client';
import { uploadFile } from '../utils/storage';
import multer from 'multer';

const upload = multer();
const router = express.Router();

router.post(
  '/api/tickets',
  requireAuth,
  upload.single('image'),
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
    const image = req.file;

    try {
      var imageUrl = await uploadFile(image);
    } catch (err) {
      throw new BadRequestError(`[CreateTicketRouter][Upload] - ${err}`);
    }

    const ticket = Ticket.build({
      title,
      price,
      category,
      description,
      image: imageUrl,
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
