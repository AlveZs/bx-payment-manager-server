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

  async getAll(): Promise<Payment[]> {
    const allPayments = await prisma.payment.findMany();

    return allPayments;
  }

  async getAllByCostumerId(customerId: number): Promise<Payment[]> {
    const allCostumerPayments = await prisma.payment.findMany({
      where: {
        customerId,
      },
    });

    return allCostumerPayments;
  }
}

