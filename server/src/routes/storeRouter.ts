import { Router } from 'express';
import * as reviewController from '../controllers/reviewController';
import * as storeController from '../controllers/storeController';
import { ctrlWrapper } from '../utils/ctrlWrapper';

export const storeRouter = Router();

storeRouter.get('/stores/nearest', ctrlWrapper(storeController.getNearestStores));
storeRouter.get('/stores', ctrlWrapper(storeController.getStores));
storeRouter.get('/customer-reviews', ctrlWrapper(reviewController.getCustomerReviews));
