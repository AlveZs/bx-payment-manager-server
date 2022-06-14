import { PaymentRepository } from "../../repositories/PaymentRepository";

export class GetAllPaymentsUseCase {

  constructor(
    private paymentRepository: PaymentRepository
  ) {}

  async execute(userId: number) {
    const allPayments = await this.paymentRepository.getAll(userId);
    
    return allPayments;
  }
}