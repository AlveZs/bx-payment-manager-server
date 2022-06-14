import { ERRORS_MESSAGES } from "../../constants/Errors";
import { CustomerRepository } from "../../repositories/CustomerRepository";
import { PaymentRepository } from "../../repositories/PaymentRepository";

export class GetAllPaymentsByCustomerUseCase {

  constructor(
    private paymentRepository: PaymentRepository,
    private customerRepository: CustomerRepository,
  ) {}

  async execute(
    userId: number,
    customerUuid: string,
    year?: number,
    month?: number
  ) {
    const customer = await this.customerRepository.getByUuid(customerUuid);

    if (customer === null) {
      return null;
    }

    if (customer.userId !== userId) {
      throw new Error(ERRORS_MESSAGES.UNAUTHORIZED);
    }

    const allPayments = await this.paymentRepository.getAllByCostumerId(
      customer.id,
      year,
      month
    );
    
    return allPayments;
  }
}