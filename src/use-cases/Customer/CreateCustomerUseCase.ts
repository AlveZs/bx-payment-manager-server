import { ERRORS_MESSAGES } from "../../constants/Errors";
import { CustomerRepository } from "../../repositories/CustomerRepository";
import { isNullOrEmpty } from "../../utils/Validator";


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

    const requiredFieldsNull = [
      name,
      number,
      userName,
      password
    ].filter(isNullOrEmpty);

    if(requiredFieldsNull.length > 0) {
      throw new Error(ERRORS_MESSAGES.REQUIRED_ERROR);
    }

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