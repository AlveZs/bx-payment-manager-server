import { Customer } from "@prisma/client";
import { prisma } from "../../prisma";
import { Prisma } from '@prisma/client'
import {
  CustomerCreateData,
  CustomerUpdateData,
  CustomerRepository,
} from "../CustomerRepository";
import { ERRORS_MESSAGES } from "../../constants/Errors";

export class PrismaCustomerRepository implements CustomerRepository {
  async create({
    name,
    userName,
    nickname,
    number,
    password,
    wifiPassword,
    address,
    phone
  }: CustomerCreateData) {
    await prisma.customer.create({
      data: {
        name,
        nickname,
        userName,
        number,
        password,
        wifiPassword,
        address,
        phone
      },
    });
  }

  async update(
    customerUuid: string,
    {
      name,
      nickname,
      userName,
      number,
      password,
      wifiPassword,
      address,
      phone
    }: CustomerUpdateData
  ) {
    try {
      await prisma.customer.update({
        where: {
          uuid: customerUuid,
        },
        data: {
          name,
          nickname,
          userName,
          number,
          password,
          wifiPassword,
          address,
          phone
        }
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new Error(ERRORS_MESSAGES.CUSTOMER_NOT_FOUND);
        }
      }
      throw error;
    }
  }

  async delete(customerUuid: string) {
    try {
      await prisma.customer.update({
        where: {
          uuid: customerUuid,
        },
        data: {
          deleted: new Date()
        }
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new Error(ERRORS_MESSAGES.CUSTOMER_NOT_FOUND);
        }
      }
      throw error;
    }
  }

  async getByUuid(customerUuid: string): Promise<Customer | null> {
    const customer = await prisma.customer.findUnique({
      where: {
        uuid: customerUuid,
      },
      include: {
        payments: true,
      },
    });

    return customer;
  }

  async getAll(): Promise<Customer[]> {
    const allCostumers = await prisma.customer.findMany({
      include: {
        payments: {          
          orderBy: {
            date: 'desc',
          },
        },
      },
    });

    return allCostumers;
  }
}

