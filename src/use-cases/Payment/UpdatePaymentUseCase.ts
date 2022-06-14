import { ERRORS_MESSAGES } from "../../constants/Errors";
import { PaymentRepository } from "../../repositories/PaymentRepository";

export interface UpdatePaymentUseCaseRequest {
  date: Date,
  value: number,
  description?: string,
  type?: string,
}

export class UpdatePaymentUseCase {

  constructor(
    private paymentRepository: PaymentRepository
  ) {}

  async execute(
    userId: number,
    paymentUuid: string,
    request: UpdatePaymentUseCaseRequest
  ) {
    const {
      date,
      value,
      description,
      type,
    } = request;

    const payment = await this.paymentRepository.getByUuid(paymentUuid);

    if (payment) {

      if (payment.Customer?.userId !== userId) {
        throw new Error(ERRORS_MESSAGES.UNAUTHORIZED);
      }

      await this.paymentRepository.update(
        paymentUuid,
        {
          date,
          value,
          description,
          type,
        }
      );
    } else {
      throw new Error(ERRORS_MESSAGES.PAYMENT_NOT_FOUND);
    }
  }
}