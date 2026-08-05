import { Router } from 'express';
import * as cartController from '../controllers/cartController';
import { authenticate } from '../middlewares/authenticate';
import { validateBody } from '../middlewares/validateBody';
import { addToCartSchema, checkoutSchema, updateCartSchema } from '../schemas/cartSchemas';
import { ctrlWrapper } from '../utils/ctrlWrapper';

export const cartRouter = Router();

cartRouter.use(authenticate);

cartRouter.get('/', ctrlWrapper(cartController.getCart));
cartRouter.post('/add', validateBody(addToCartSchema), ctrlWrapper(cartController.addToCart));
cartRouter.put('/update', validateBody(updateCartSchema), ctrlWrapper(cartController.updateCartItem));
cartRouter.delete('/item/:productId', ctrlWrapper(cartController.removeCartItem));
cartRouter.post('/checkout', validateBody(checkoutSchema), ctrlWrapper(cartController.checkout));
