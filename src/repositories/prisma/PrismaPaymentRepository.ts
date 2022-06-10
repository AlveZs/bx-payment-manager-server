import { Payment, Prisma } from "@prisma/client";
import { ERRORS_MESSAGES } from "../../constants/Errors";
import { prisma } from "../../prisma";
import { PaymentCreateData, PaymentRepository, PaymentUpdateData } from "../PaymentRepository";

export class PrismaPaymentRepository implements PaymentRepository {
  async create(
    customerId: number,
    {
      value,
      date,
      type,
      description,
    }: PaymentCreateData
  ) {
    await prisma.payment.create({
      data: {
        value,
        date,
        customerId,
        description,
        type,
      },
    });
  }

  async update(
    paymentUuid: string,
    {
      date,
      value,
      type,
      description,
    }: PaymentUpdateData
  ) {
    try {
      await prisma.payment.update({
        where: {
          uuid: paymentUuid,
        },
        data: {
          date,
          value,
          type,
          description,
        }
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new Error(ERRORS_MESSAGES.PAYMENT_NOT_FOUND);
        }
      }
      
      throw error;
    }
  }

  async delete(paymentUuid: string) {
    try {
      await prisma.payment.delete({
        where: {
          uuid: paymentUuid,
        },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new Error(ERRORS_MESSAGES.PAYMENT_NOT_FOUND);
        }
      }
      
      throw error;
    }
  }

  async getByUuid(paymentUuid: string): Promise<Payment | null> {
    const payment = await prisma.payment.findUnique({
      where: {
        uuid: paymentUuid,
      },
    });

    return payment;
  }

  async getAll(year?: number): Promise<Payment[]> {
    let whereCondition: any = {};

    if (year) {
      whereCondition.date = {
        gte: new Date(year, 0, 1),
        lte:  new Date(year, 12, 0),
      }
    }
    
    const allPayments = await prisma.payment.findMany({
      where: whereCondition,
    });

    return allPayments;
  }

  async getAllByCostumerId(customerId: number, year?: number, month?: number): Promise<Payment[]> {
    let whereCondition: {customerId: number, date?: any} = {
      customerId,
    };

    if (month) {
      let yearFilter = year || new Date().getFullYear();
      whereCondition.date = {
        gte: new Date(yearFilter, month - 1, 1),
        lte:  new Date(yearFilter, month, 0),
      }
    }

    const allCostumerPayments = await prisma.payment.findMany({
      where: {
        ...whereCondition
      },
    });

    return allCostumerPayments;
  }
}

