import { ERRORS_MESSAGES } from "../../constants/Errors";
import { PaymentRepository } from "../../repositories/PaymentRepository";

export class DeletePaymentUseCase {

  constructor(
    private paymentRepository: PaymentRepository
  ) {}

  async execute(userId: number, paymentUuid: string) {
    const payment = await this.paymentRepository.getByUuid(paymentUuid);

    if (payment?.Customer?.userId !== userId) {
      throw new Error(ERRORS_MESSAGES.UNAUTHORIZED);
    }

    await this.paymentRepository.delete(paymentUuid);
  }
}