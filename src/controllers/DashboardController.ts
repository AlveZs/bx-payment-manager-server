import { Request, Response } from "express";
import { ERRORS_MESSAGES } from "../constants/Errors";
import { PrismaCustomerRepository } from "../repositories/prisma/PrismaCustomerRepository";
import { PrismaPaymentRepository } from "../repositories/prisma/PrismaPaymentRepository";
import { DashboardInfosUseCase } from "../use-cases/Dashboard/DashboardInfosUseCase";

class DashboardController {
  async getDashboardInfos(request: Request, response: Response) {
    const { userId } = response.locals.jwtPayload

    let year = request.query?.year ? parseInt(request.query.year.toString()) : undefined;
    let month = request.query?.month ? parseInt(request.query.month.toString()) : undefined;

    const prismaPaymentRepository = new PrismaPaymentRepository();
    const prismaCustomerRepository = new PrismaCustomerRepository();

    const getDashboardInfosUseCase = new DashboardInfosUseCase(
      prismaPaymentRepository,
      prismaCustomerRepository
    );

    try {
      const payments = await getDashboardInfosUseCase.execute(userId, year, month);
      return response.status(200).json({ Infos: payments });
    } catch (error) {
      return response
        .status(500)
        .json({ message: ERRORS_MESSAGES.INTERNAL_SERVER });
    }
  }
}

export { DashboardController };
