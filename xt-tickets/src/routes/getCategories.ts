import { TicketCategory } from '@gb-xtickets/common';
import express, { Request, Response } from 'express';

const router = express.Router();

router.get('/api/categories', async (req: Request, res: Response) => {
  res.status(200).send(Object.values(TicketCategory));
});

export { router as getTicketCategoriesRouter };
