import { ERRORS_MESSAGES } from "../../constants/Errors";
import { CustomerRepository } from "../../repositories/CustomerRepository";
import { isNullOrEmpty } from "../../utils/Validator";


export interface CreateCustomerUseCaseRequest {
  name: string;
  nickname?: string;
  number: number;
  userName: string;
  password: string;
  wifiPassword?: string;
  address?: string;
  phone?: string;
}

export class CreateCustomerUseCase {

  constructor(
    private customerRepository: CustomerRepository
  ) {}

  async execute(request: CreateCustomerUseCaseRequest) {
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

    const requiredFieldsNull = [
      name,
      number,
      userName,
      password,
    ].filter(isNullOrEmpty);

    if(requiredFieldsNull.length > 0) {
      throw new Error(ERRORS_MESSAGES.REQUIRED_ERROR);
    }

    await this.customerRepository.create({
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