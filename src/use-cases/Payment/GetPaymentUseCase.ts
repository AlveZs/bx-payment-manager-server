import { PaymentRepository } from "../../repositories/PaymentRepository";

export class GetPaymentUseCase {

  constructor(
    private paymentRepository: PaymentRepository
  ) {}

  async execute(paymentUuid: string) {
    const payment = await this.paymentRepository.getByUuid(paymentUuid);
    
    return payment;
  }
}