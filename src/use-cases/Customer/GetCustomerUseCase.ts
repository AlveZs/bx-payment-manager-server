import { CustomerRepository } from "../../repositories/CustomerRepository";

export class GetCustomerUseCase {

  constructor(
    private customerRepository: CustomerRepository
  ) {}

  async execute(customerUuid: string) {
    const customer = await this.customerRepository.getByUuid(customerUuid);
    
    return customer;
  }
}