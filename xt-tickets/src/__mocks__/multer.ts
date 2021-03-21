import { Request, Response, NextFunction } from 'express';

const multer = () => ({
  single: () =>
    jest
      .fn()
      .mockImplementation((req: Request, res: Response, next: NextFunction) => {
        next();
      }),
});

export default multer;
