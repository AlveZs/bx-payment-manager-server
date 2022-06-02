import { CustomerRepository } from "../../repositories/CustomerRepository";
import { PaymentRepository } from "../../repositories/PaymentRepository";

export class GetAllPaymentsByCustomerUseCase {

  constructor(
    private paymentRepository: PaymentRepository,
    private customerRepository: CustomerRepository,
  ) {}

  async execute(customerUuid: string) {
    const customer = await this.customerRepository.getByUuid(customerUuid);

    if (customer === null) {
      return null;
    }

    const allPayments = await this.paymentRepository.getAllByCostumerId(customer.id);
    
    return allPayments;
  }
}