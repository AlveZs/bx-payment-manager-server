import { Request, Response } from 'express';
import { ERRORS_MESSAGES } from '../constants/Errors';
import { PrismaCustomerRepository } from '../repositories/prisma/PrismaCustomerRepository';
import { CreateCustomerUseCase } from '../use-cases/Customer/CreateCustomerUseCase';
import { DeleteCustomerUseCase } from '../use-cases/Customer/DeleteCustomerUseCase';
import { GetAllCustomersUseCase } from '../use-cases/Customer/GetAllCustomersUseCase';
import { GetCustomerUseCase } from '../use-cases/Customer/GetCustomerUseCase';
import { UpdateCustomerUseCase } from '../use-cases/Customer/UpdateCustomerUseCase';

class CustomerController {
  async create(request: Request, response: Response) {
    const {
      name,
      number,
      userName,
      password,
      wifiPassword,
      address
    } = request.body
  
    const prismaCustomerRepository = new PrismaCustomerRepository();
  
    const createCustomerUseCase = new CreateCustomerUseCase(
      prismaCustomerRepository
    );

    try {
      await createCustomerUseCase.execute({
        name,
        number,
        userName,
        password,
        wifiPassword,
        address
      });
    } catch (error) {
      if (error instanceof Error && error.message === ERRORS_MESSAGES.REQUIRED_ERROR) {
        return response.status(400).send();
      }
    }
  
    return response.status(201).send();
  }

  async update(request: Request, response: Response) {
    const {
      name,
      number,
      userName,
      password,
      wifiPassword,
      address
    } = request.body
  
    const customerUuid = request.params.customerUuid
  
    const prismaCustomerRepository = new PrismaCustomerRepository();
  
    const updateCustomerUseCase = new UpdateCustomerUseCase(
      prismaCustomerRepository
    );

    try {
      await updateCustomerUseCase.execute(
        customerUuid,
        {
          name,
          number,
          userName,
          password,
          wifiPassword,
          address
        });
    } catch (error) {
      if (error instanceof Error && error.message === ERRORS_MESSAGES.CUSTOMER_NOT_FOUND) {
        return response.status(422).send();
      }

      return response.status(500).send();
    }
  
    return response.status(200).send();
  }

  async getAll(request: Request, response: Response) {
    const prismaCustomerRepository = new PrismaCustomerRepository();
  
    const getAllCustomersUseCase = new GetAllCustomersUseCase(
      prismaCustomerRepository
    );
  
    const allCustomers = await getAllCustomersUseCase.execute();
  
    return response.status(200).json({ Customers: allCustomers }).send();
  }

  async delete(request: Request, response: Response) {
    const customerUuid = request.params.customerUuid
  
    const prismaCustomerRepository = new PrismaCustomerRepository();
  
    const deleteCustomerUseCase = new DeleteCustomerUseCase(
      prismaCustomerRepository
    );
  
    try {
      await deleteCustomerUseCase.execute(customerUuid);
    } catch (error) {
      if (error instanceof Error && error.message === ERRORS_MESSAGES.CUSTOMER_NOT_FOUND) {
        return response.status(422).send();
      }

      return response.status(500).send();
    }
  
    return response.status(200).send()
  }

  async getByUuid(request: Request, response: Response) {
    const customerUuid = request.params.customerUuid
  
    const prismaCustomerRepository = new PrismaCustomerRepository();
  
    const getCustomerUseCase = new GetCustomerUseCase(
      prismaCustomerRepository
    );
  
    const customer = await getCustomerUseCase.execute(customerUuid)
  
    return response.status(200).json({ Customer: customer }).send();
  }
}

export { CustomerController };