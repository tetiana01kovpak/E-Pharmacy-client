import { Router } from 'express';
import * as userController from '../controllers/userController';
import { authenticate } from '../middlewares/authenticate';
import { validateBody } from '../middlewares/validateBody';
import { loginSchema, registerSchema } from '../schemas/authSchemas';
import { ctrlWrapper } from '../utils/ctrlWrapper';

export const userRouter = Router();

userRouter.post('/register', validateBody(registerSchema), ctrlWrapper(userController.register));
userRouter.post('/login', validateBody(loginSchema), ctrlWrapper(userController.login));
userRouter.post('/refresh', ctrlWrapper(userController.refresh));
userRouter.get('/logout', authenticate, ctrlWrapper(userController.logout));
userRouter.get('/user-info', authenticate, ctrlWrapper(userController.getUserInfo));
