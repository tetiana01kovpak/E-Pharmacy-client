import { IUser } from '../models/User';

declare global {
  namespace Express {
    interface Request {
      user?: Pick<IUser, '_id' | 'name' | 'email' | 'phone'>;
    }
  }
}

export {};
