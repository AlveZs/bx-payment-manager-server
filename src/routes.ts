import express from 'express'

import { CustomerController } from './controllers/CustomerController';
import { PaymentController } from './controllers/PaymentController';

export const routes = express.Router()

const customerController = new CustomerController();
const paymentController = new PaymentController();

routes.post('/customers', customerController.create);

routes.put('/customers/:customerUuid', customerController.update);

routes.get('/customers/:customerUuid/delete', customerController.delete);

routes.get('/customers/:customerUuid', customerController.getByUuid);

routes.get('/customers', customerController.getAll);

// Payment routes

routes.post('/customers/:customerUuid/payments', paymentController.create);

routes.put('/payments/:paymentUuid', paymentController.update);

routes.get('/payments/:paymentUuid/delete', paymentController.delete);

routes.get('/payments/:paymentUuid', paymentController.getByUuid);

routes.get('/customers/:customerUuid/payments', paymentController.getByCustomer);

routes.get('/payments', paymentController.getAll);