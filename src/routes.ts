import express from 'express'

import { CustomerController } from './controllers/CustomerController';

export const routes = express.Router()

const customerController = new CustomerController();

routes.post('/customers', customerController.create);

routes.put('/customers/:customerUuid', customerController.update);

routes.get('/customers/:customerUuid/delete', customerController.delete);

routes.get('/customers/:customerUuid', customerController.getByUuid);

routes.get('/customers', customerController.getAll);