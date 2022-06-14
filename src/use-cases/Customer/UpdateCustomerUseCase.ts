import { ERRORS_MESSAGES } from "../../constants/Errors";
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
  ) { }

  async execute(
    userId: number,
    customerUuid: string,
    request: UpdateCustomerUseCaseRequest
  ) {
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

    const customer = await this.customerRepository.getByUuid(customerUuid);

    if (customer) {
      if (customer.userId !== userId) {
        throw new Error(ERRORS_MESSAGES.UNAUTHORIZED);
      }
      
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
    } else {
      throw new Error(ERRORS_MESSAGES.CUSTOMER_NOT_FOUND);
    }
  }
}