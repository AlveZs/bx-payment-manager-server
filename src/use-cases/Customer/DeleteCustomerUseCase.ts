import { ERRORS_MESSAGES } from "../../constants/Errors";
import { CustomerRepository } from "../../repositories/CustomerRepository";

export class DeleteCustomerUseCase {

  constructor(
    private customerRepository: CustomerRepository
  ) {}

  async execute(userId: number, customerUuid: string) {
    const customer = await this.customerRepository.getByUuid(customerUuid);

    if (customer?.userId !== userId) {
      throw new Error(ERRORS_MESSAGES.UNAUTHORIZED);
    }

    await this.customerRepository.delete(customerUuid);
  }
}