import { Router } from 'express';
import * as dashboardController from '../controllers/dashboardController';
import { authenticate } from '../middlewares/authenticate';
import { ctrlWrapper } from '../utils/ctrlWrapper';

export const dashboardRouter = Router();

dashboardRouter.use(authenticate);

dashboardRouter.get('/suppliers', ctrlWrapper(dashboardController.getSuppliers));
dashboardRouter.get('/finance', ctrlWrapper(dashboardController.getFinanceEntries));
