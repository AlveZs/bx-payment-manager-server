import { CustomerRepository } from "../../repositories/CustomerRepository";

export class DeleteCustomerUseCase {

  constructor(
    private customerRepository: CustomerRepository
  ) {}

  async execute(customerUuid: string) {
    await this.customerRepository.delete(customerUuid);
  }
}