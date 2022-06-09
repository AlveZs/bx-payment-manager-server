import { CustomerRepository } from "../../repositories/CustomerRepository";


export interface UpdateCustomerUseCaseRequest {
  name: string;
  nickname?: string;
  number: number;
  userName: string;
  password: string;
  wifiPassword?: string;
  address?: string;
  phone?: string;
}

export class UpdateCustomerUseCase {

  constructor(
    private customerRepository: CustomerRepository
  ) {}

  async execute(customerUuid: string, request: UpdateCustomerUseCaseRequest) {
    const {
      name,
      nickname,
      number,
      userName,
      password,
      wifiPassword,
      address,
      phone
    } = request;

    await this.customerRepository.update(
    customerUuid,
    {
      name,
      nickname,
      number,
      userName,
      password,
      wifiPassword,
      address,
      phone
    });
  }
}