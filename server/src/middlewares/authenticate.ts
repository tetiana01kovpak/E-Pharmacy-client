import { NextFunction, Request, Response } from 'express';
import { TokenExpiredError } from 'jsonwebtoken';
import { User } from '../models/User';
import { verifyAccessToken } from '../services/tokenService';
import { HttpError } from '../utils/HttpError';

export async function authenticate(req: Request, _res: Response, next: NextFunction): Promise<void> {
  try {
    const header = req.headers.authorization;
    if (!header || !header.startsWith('Bearer ')) {
      throw new HttpError(401, 'Authorization header missing');
    }

    const token = header.slice('Bearer '.length);

    let payload;
    try {
      payload = verifyAccessToken(token);
    } catch (err) {
      if (err instanceof TokenExpiredError) {
        throw new HttpError(401, 'Access token expired', { code: 'TOKEN_EXPIRED' });
      }
      throw new HttpError(401, 'Invalid access token');
    }

    const user = await User.findById(payload.sub);
    if (!user) {
      throw new HttpError(401, 'User not found');
    }

    req.user = { _id: user._id, name: user.name, email: user.email, phone: user.phone };
    next();
  } catch (err) {
    next(err);
  }
}
