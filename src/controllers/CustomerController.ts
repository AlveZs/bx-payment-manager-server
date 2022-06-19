import { Request, Response } from 'express';
import { ERRORS_MESSAGES } from '../constants/Errors';
import { Customer } from '../model/Customer';
import { PrismaCustomerRepository } from '../repositories/prisma/PrismaCustomerRepository';
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

    const { userId } = response.locals.jwtPayload;

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
        phone,
        userId
      });
    } catch (error) {
      if (error instanceof Error && error.message === ERRORS_MESSAGES.REQUIRED_ERROR) {
        return response.status(400).json({ message: error.message });
      }

      return response
        .status(500)
        .json({ message: ERRORS_MESSAGES.INTERNAL_SERVER });
    }

    return response.status(201).send();
  }

  async update(request: Request, response: Response) {
    const { userId } = response.locals.jwtPayload;

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
        userId,
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
      if (error instanceof Error) {
        let errorStatus = 400;

        if (error.message === ERRORS_MESSAGES.CUSTOMER_NOT_FOUND) {
          errorStatus = 400;
        } else if (error.message === ERRORS_MESSAGES.UNAUTHORIZED) {
          errorStatus = 401;
        }

        return response.status(errorStatus).json({ message: error.message });
      }

      return response.status(500).send();
    }

    return response.status(200).send();
  }

  async getAll(request: Request, response: Response) {
    const { userId } = response.locals.jwtPayload;

    const prismaCustomerRepository = new PrismaCustomerRepository();

    const getAllCustomersUseCase = new GetAllCustomersUseCase(
      prismaCustomerRepository
    );

    const allCustomers = await getAllCustomersUseCase.execute(userId);

    return response.status(200).json({ Customers: allCustomers });
  }

  async delete(request: Request, response: Response) {
    const { userId } = response.locals.jwtPayload;

    const customerUuid = request.params.customerUuid

    const prismaCustomerRepository = new PrismaCustomerRepository();

    const deleteCustomerUseCase = new DeleteCustomerUseCase(
      prismaCustomerRepository
    );

    try {
      await deleteCustomerUseCase.execute(userId, customerUuid);
    } catch (error) {
      if (error instanceof Error) {
        let errorStatus = 400;

        if (
          error.message === ERRORS_MESSAGES.REQUIRED_ERROR ||
          error.message === ERRORS_MESSAGES.CUSTOMER_NOT_FOUND
        ) {
          errorStatus = 400;
        } else if (error.message === ERRORS_MESSAGES.UNAUTHORIZED) {
          errorStatus = 401;
        }

        return response.status(errorStatus).json({ message: error.message });
      }

      return response.status(500).send();
    }

    return response.status(200).send()
  }

  async getByUuid(request: Request, response: Response) {
    const { userId } = response.locals.jwtPayload;

    const customerUuid = request.params.customerUuid

    const prismaCustomerRepository = new PrismaCustomerRepository();

    const getCustomerUseCase = new GetCustomerUseCase(
      prismaCustomerRepository
    );

    try {
      const customer = await getCustomerUseCase.execute(userId, customerUuid)
      return response.status(200).json({ Customer: customer });
    } catch (error) {
      if (error instanceof Error && error.message === ERRORS_MESSAGES.UNAUTHORIZED) {
        return response.status(401).json({ message: error.message });
      }

      return response.status(500).send();
    }
  }

  async importFromCsv(request: Request, response: Response) {
    const prismaCustomerRepository = new PrismaCustomerRepository();

    const file = request.files;
    const { userId, delimiter } = request.query;

    if (!userId) {
      return response.status(400).send("User ID not found");
    }

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
        parseInt(`${userId}`),
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