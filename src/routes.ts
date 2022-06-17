import express from 'express'
import { AuthController } from './controllers/AuthController';

import { CustomerController } from './controllers/CustomerController';
import { PaymentController } from './controllers/PaymentController';
import { RefreshTokenController } from './controllers/RefreshTokenController';
import { verifyToken } from './middlewares/VerifyToken';

export const routes = express.Router()

const customerController = new CustomerController();
const paymentController = new PaymentController();
const authController = new AuthController();
const refreshTokenController = new RefreshTokenController();


routes.get('/', (req, res) => {
  res.status(200).send("Server is fine");
});

routes.use('/customers', verifyToken);

routes.use('/payments', verifyToken);

routes.use('/dashboard', verifyToken);

// Auth routes

routes.post('/register', authController.register);

routes.post('/login', authController.login);

routes.get('/logout', authController.logout);

routes.get('/refresh', refreshTokenController.refreshTokenUpdate);

routes.get('/user', verifyToken, authController.getLoggedUser);

routes.put('/user', verifyToken, authController.update);

// Customer routes

routes.post('/customers', verifyToken, customerController.create);

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

routes.get('/dashboard', paymentController.getPaymentInfos);