import { ERRORS_MESSAGES } from "../../constants/Errors";
import { CustomerRepository } from "../../repositories/CustomerRepository";
import { PaymentRepository } from "../../repositories/PaymentRepository";
import { isNullOrEmpty } from "../../utils/Validator";


export interface CreatePaymentUseCaseRequest {
  date: Date,
  value: number,
  description?: string,
  type?: string,
}

export class CreatePaymentUseCase {

  constructor(
    private paymentRepository: PaymentRepository,
    private customerRepository: CustomerRepository,
  ) {}

  async execute(customerUuid: string, request: CreatePaymentUseCaseRequest) {
    const {
      date,
      value,
      description,
      type,
    } = request;

    const customer = await this.customerRepository.getByUuid(customerUuid);

    if (customer === null) {
      throw new Error(ERRORS_MESSAGES.CUSTOMER_NOT_FOUND);
    }

    const requiredFieldsNull = [
      date,
      value
    ].filter(isNullOrEmpty);

    if(requiredFieldsNull.length > 0) {
      throw new Error(ERRORS_MESSAGES.REQUIRED_ERROR);
    }

    await this.paymentRepository.create(customer.id, {
      date,
      value,
      description,
      type,
    });
  }
}