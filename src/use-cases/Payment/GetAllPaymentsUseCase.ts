import { PaymentRepository } from "../../repositories/PaymentRepository";

export class GetAllPaymentsUseCase {

  constructor(
    private paymentRepository: PaymentRepository
  ) {}

  async execute() {
    const allPayments = await this.paymentRepository.getAll();
    
    return allPayments;
  }
}