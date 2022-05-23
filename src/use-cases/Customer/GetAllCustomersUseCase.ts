import { CustomerRepository } from "../../repositories/CustomerRepository";

export class GetAllCustomersUseCase {

  constructor(
    private customerRepository: CustomerRepository
  ) {}

  async execute() {
    const allCostumers = await this.customerRepository.getAll();
    
    return allCostumers;
  }
}