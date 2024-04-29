import { CustomerFilter } from "../../interfaces/CustomerFilter";
import { CustomerRepository } from "../../repositories/CustomerRepository";

export class GetAllCustomersUseCase {

  constructor(
    private customerRepository: CustomerRepository,
  ) {}

  async execute(userId: number, filters: CustomerFilter) {
    const allCostumers = await this.customerRepository.getAll(userId, filters);
    
    return allCostumers;
  }
}