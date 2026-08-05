import { Router } from 'express';
import * as productController from '../controllers/productController';
import * as reviewController from '../controllers/reviewController';
import { ctrlWrapper } from '../utils/ctrlWrapper';

export const productRouter = Router();

productRouter.get('/categories', ctrlWrapper(productController.getCategories));
productRouter.get('/', ctrlWrapper(productController.getProducts));
productRouter.get('/:id', ctrlWrapper(productController.getProductById));
productRouter.get('/:id/reviews', ctrlWrapper(reviewController.getProductReviews));
