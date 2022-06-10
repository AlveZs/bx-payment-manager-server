import { Request, Response } from 'express';
import { ERRORS_MESSAGES } from '../constants/Errors';
import { PrismaCustomerRepository } from '../repositories/prisma/PrismaCustomerRepository';
import { PrismaPaymentRepository } from '../repositories/prisma/PrismaPaymentRepository';
import { CreatePaymentUseCase } from '../use-cases/Payment/CreatePaymentUseCase';
import { DeletePaymentUseCase } from '../use-cases/Payment/DeletePaymentUseCase';
import { GetAllPaymentsByCustomerUseCase } from '../use-cases/Payment/GetAllPaymentsByCustomerUseCase';
import { GetAllPaymentsUseCase } from '../use-cases/Payment/GetAllPaymentsUseCase';
import { GetPaymentUseCase } from '../use-cases/Payment/GetPaymentUseCase';
import { PaymentDashboardInfosUseCase } from '../use-cases/Payment/PaymentDashboardInfosUseCase';
import { UpdatePaymentUseCase } from '../use-cases/Payment/UpdatePaymentUseCase';

class PaymentController {
  async create(request: Request, response: Response) {

    const {
      date,
      value,
      description,
      type,
    } = request.body

    const customerUuid = request.params.customerUuid

    const prismaCustomerRepository = new PrismaCustomerRepository();
    const prismaPaymentRepository = new PrismaPaymentRepository();

    const createPaymentUseCase = new CreatePaymentUseCase(
      prismaPaymentRepository,
      prismaCustomerRepository
    );

    try {
      await createPaymentUseCase.execute(
        customerUuid,
        {
          date,
          value,
          description,
          type
        }
      );
    } catch (error) {
      if (error instanceof Error && (
        error.message === ERRORS_MESSAGES.REQUIRED_ERROR ||
        error.message === ERRORS_MESSAGES.CUSTOMER_NOT_FOUND
      )) {
        return response.status(400).send();
      }

      return response.status(500).send();
    }

    return response.status(201).send();
  }

  async update(request: Request, response: Response) {
    const {
      date,
      value,
      description,
      type,
    } = request.body

    const paymentUuid = request.params.paymentUuid

    const prismaPaymentRepository = new PrismaPaymentRepository();

    const updatePaymentUseCase = new UpdatePaymentUseCase(
      prismaPaymentRepository
    );

    try {
      await updatePaymentUseCase.execute(
        paymentUuid,
        {
          date,
          value,
          description,
          type,
        }
      );
    } catch (error) {
      if (error instanceof Error && error.message === ERRORS_MESSAGES.PAYMENT_NOT_FOUND) {
        return response.status(400).send();
      }

      return response.status(500).send();
    }

    return response.status(200).send();
  }

  async getAll(request: Request, response: Response) {
    const prismaPaymentRepository = new PrismaPaymentRepository();

    const getAllPaymentsUseCase = new GetAllPaymentsUseCase(
      prismaPaymentRepository
    );

    const allPayments = await getAllPaymentsUseCase.execute();

    return response.status(200).json({ Payments: allPayments }).send();
  }

  async delete(request: Request, response: Response) {
    const paymentUuid = request.params.paymentUuid

    const prismaPaymentRepository = new PrismaPaymentRepository();

    const deletePaymentUseCase = new DeletePaymentUseCase(
      prismaPaymentRepository
    );

    try {
      await deletePaymentUseCase.execute(paymentUuid);
    } catch (error) {
      if (error instanceof Error && error.message === ERRORS_MESSAGES.PAYMENT_NOT_FOUND) {
        return response.status(400).send();
      }

      return response.status(500).send();
    }

    return response.status(200).send();
  }

  async getByUuid(request: Request, response: Response) {
    const paymentUuid = request.params.paymentUuid

    const prismaPaymentRepository = new PrismaPaymentRepository();

    const getPaymentUseCase = new GetPaymentUseCase(
      prismaPaymentRepository
    );

    const payment = await getPaymentUseCase.execute(paymentUuid)

    return response.status(200).json({ Payment: payment }).send();
  }

  async getByCustomer(request: Request, response: Response) {
    const customerUuid = request.params.customerUuid
    let year = request.query?.year ? parseInt(request.query.year.toString()) : undefined;
    let month = request.query?.month ? parseInt(request.query.month.toString()) : undefined;


    const prismaPaymentRepository = new PrismaPaymentRepository();
    const prismaCustomerRepository = new PrismaCustomerRepository();

    const getPaymentByCustomerUseCase = new GetAllPaymentsByCustomerUseCase(
      prismaPaymentRepository,
      prismaCustomerRepository,
    );

    const payments = await getPaymentByCustomerUseCase.execute(customerUuid, year, month);

    return response.status(200).json({ Payments: payments }).send();
  }

  async getPaymentInfos(request: Request, response: Response) {
    let year = request.query?.year ? parseInt(request.query.year.toString()) : undefined;

    const prismaPaymentRepository = new PrismaPaymentRepository();

    const getDashboardInfosUseCase = new PaymentDashboardInfosUseCase(
      prismaPaymentRepository
    );

    const payments = await getDashboardInfosUseCase.execute(year);

    return response.status(200).json({ Infos: payments }).send();
  }
}

export { PaymentController };