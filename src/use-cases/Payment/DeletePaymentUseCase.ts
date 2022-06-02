import { PaymentRepository } from "../../repositories/PaymentRepository";

export class DeletePaymentUseCase {

  constructor(
    private paymentRepository: PaymentRepository
  ) {}

  async execute(paymentUuid: string) {
    await this.paymentRepository.delete(paymentUuid);
  }
}