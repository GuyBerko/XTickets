import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import jwt from 'jsonwebtoken';
import { BadRequestError, validateRequest } from '@gb-xtickets/common';
import { User } from '../models/user';
import { UserCreatedPublisher } from '../events/publishers';
import { natsClient } from '../nats-client';

const router = express.Router();

router.post(
  '/api/users/signup',
  [
    body('email').isEmail().withMessage('Email not valid'),
    body('name').trim().notEmpty().withMessage('Name must be provided'),
    body('password')
      .trim()
      .isLength({ min: 4, max: 20 })
      .withMessage('Password must be between 4 and 20 characters'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { email, password, name } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      throw new BadRequestError('[Signup Route] - Email or Password invalid');
    }

    const user = User.build({ email, password, name });
    await user.save();

    // Generate JWT and store it in the session
    const userJWT = jwt.sign(
      {
        id: user.id,
        email: user.email,
        name: user.name,
      },
      process.env.JWT_KEY!
    );

    req.session = {
      jwt: userJWT,
    };

    // Publish an event saying that an user was created
    new UserCreatedPublisher(natsClient.client).publish({
      email: user.email,
      name: user.name,
      id: user.id,
    });

    res.status(201).send(user);
  }
);

export { router as signupRouter };
