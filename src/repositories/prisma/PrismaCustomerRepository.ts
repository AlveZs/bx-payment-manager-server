import { Customer } from "@prisma/client";
import { prisma } from "../../prisma";
import { Prisma } from '@prisma/client'
import {
  CustomerCreateData,
  CustomerUpdateData,
  CustomerRepository,
} from "../CustomerRepository";

export class PrismaCustomerRepository implements CustomerRepository {
  async create({
    name,
    userName,
    number,
    password,
    wifiPassword,
    address
  }: CustomerCreateData) {
    await prisma.customer.create({
      data: {
        name,
        userName,
        number,
        password,
        wifiPassword,
        address
      },
    });
  }

  async update(
    customerUuid: string,
    {
      name,
      userName,
      number,
      password,
      wifiPassword,
      address
    }: CustomerUpdateData
  ) {
    await prisma.customer.update({
      where: {
        uuid: customerUuid,
      },
      data: {
        name,
        userName,
        number,
        password,
        wifiPassword,
        address,
      }
    });
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
          throw new Error("Customer not found");
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
    });

    return customer;
  }

  async getAll(): Promise<Customer[]> {
    const allCostumers = await prisma.customer.findMany();

    return allCostumers;
  }
}

