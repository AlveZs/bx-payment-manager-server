import { CustomerRepository } from "../../repositories/CustomerRepository";


export interface UpdateCustomerUseCaseRequest {
  name: string;
  number: number;
  userName: string;
  password: string;
  wifiPassword?: string;
  address?: string;
}

export class UpdateCustomerUseCase {

  constructor(
    private customerRepository: CustomerRepository
  ) {}

  async execute(customerUuid: string, request: UpdateCustomerUseCaseRequest) {
    const {
      name,
      number,
      userName,
      password,
      wifiPassword,
      address
    } = request;

    await this.customerRepository.update(
    customerUuid,
    {
      name,
      number,
      userName,
      password,
      wifiPassword,
      address
    });
  }
}