import { CustomerRepository } from "../../repositories/CustomerRepository";


export interface CreateCustomerUseCaseRequest {
  name: string;
  number: number;
  userName: string;
  password: string;
  wifiPassword?: string;
  address?: string;
}

export class CreateCustomerUseCase {

  constructor(
    private customerRepository: CustomerRepository
  ) {}

  async execute(request: CreateCustomerUseCaseRequest) {
    const {
      name,
      number,
      userName,
      password,
      wifiPassword,
      address
    } = request;

    await this.customerRepository.create({
      name,
      number,
      userName,
      password,
      wifiPassword,
      address
    });
  }
}