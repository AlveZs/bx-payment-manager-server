import { Request, Response } from 'express';
import { ERRORS_MESSAGES } from '../constants/Errors';
import { Customer } from '../model/Customer';
import { PrismaCustomerRepository } from '../repositories/prisma/PrismaCustomerRepository';
import { PrismaPaymentRepository } from '../repositories/prisma/PrismaPaymentRepository';
import { CreateCustomerUseCase } from '../use-cases/Customer/CreateCustomerUseCase';
import { DeleteCustomerUseCase } from '../use-cases/Customer/DeleteCustomerUseCase';
import { GetAllCustomersUseCase } from '../use-cases/Customer/GetAllCustomersUseCase';
import { GetCustomerUseCase } from '../use-cases/Customer/GetCustomerUseCase';
import { ImportCsvUseCase } from '../use-cases/Customer/ImportCsvUseCase';
import { UpdateCustomerUseCase } from '../use-cases/Customer/UpdateCustomerUseCase';

class CustomerController {
  async create(request: Request, response: Response) {
    const {
      name,
      nickname,
      number,
      userName,
      password,
      wifiPassword,
      address,
      phone
    } = request.body
  
    const prismaCustomerRepository = new PrismaCustomerRepository();
  
    const createCustomerUseCase = new CreateCustomerUseCase(
      prismaCustomerRepository
    );

    try {      
      await createCustomerUseCase.execute({
        name,
        nickname,
        number,
        userName,
        password,
        wifiPassword,
        address,
        phone
      });
    } catch (error) {
      if (error instanceof Error && error.message === ERRORS_MESSAGES.REQUIRED_ERROR) {
        return response.status(400).send();
      }

      return response.status(500).send();
    }
  
    return response.status(201).send();
  }

  async update(request: Request, response: Response) {
    const {
      name,
      nickname,
      number,
      userName,
      password,
      wifiPassword,
      address,
      phone
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
          nickname,
          number,
          userName,
          password,
          wifiPassword,
          address,
          phone
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

  async importFromCsv(request: Request, response: Response) {
    const prismaCustomerRepository = new PrismaCustomerRepository();

    const file = request.files;
    const { delimiter } = request.query; 

    if (!file?.csv) {
      return response.status(500).json({ message: "No files uploaded" });
    }

    const { data } = file.csv as any;
  
    const importCsvUseCase = new ImportCsvUseCase(
      prismaCustomerRepository,
    );

    let costumers: Customer[] = [];

    try {
      costumers = await importCsvUseCase.execute(
        data,
        response,
        delimiter ? `${delimiter}` : undefined
      );
    } catch (error) {
      console.log(error);
      return response.sendStatus(500);
    }

    return response.status(200).json({ ImportedCustomers: costumers }).send();
  }
}

export { CustomerController };