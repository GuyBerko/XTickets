import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import jwt from 'jsonwebtoken';
import { BadRequestError, validateRequest } from '@gb-xtickets/common';
import { User } from '../models/user';
import { PasswordManager } from '../utils/password-manager';

const router = express.Router();

router.post(
  '/api/users/signin',
  [
    body('email').isEmail().withMessage('Email not valid'),
    body('password').trim().notEmpty().withMessage('Password was not provided'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });

    if (!existingUser) {
      throw new BadRequestError('Invalid credentials');
    }

    const passwordValid = await PasswordManager.compare(
      existingUser.password,
      password
    );

    if (!passwordValid) {
      throw new BadRequestError('Invalid credentials');
    }

    // Generate JWT and store it in the session
    const userJWT = jwt.sign(
      {
        id: existingUser.id,
        email: existingUser.email,
      },
      process.env.JWT_KEY!
    );

    req.session = {
      jwt: userJWT,
    };

    res.status(200).send(existingUser);
  }
);

export { router as signinRouter };
