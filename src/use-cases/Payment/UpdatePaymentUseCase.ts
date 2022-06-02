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

  async execute(paymentUuid: string, request: UpdatePaymentUseCaseRequest) {
    const {
      date,
      value,
      description,
      type,
    } = request;

    await this.paymentRepository.update(
      paymentUuid,
      {
        date,
        value,
        description,
        type,
      }
    );
  }
}