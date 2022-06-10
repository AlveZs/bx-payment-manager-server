import { PaymentRepository } from "../../repositories/PaymentRepository";

export interface AmountByMonth {
  month: number,
  amount: number
}

export interface PaymentInfos {
  totalAmount: number;
  amountByMonth: any;
}

export class PaymentDashboardInfosUseCase {

  constructor(
    private paymentRepository: PaymentRepository
  ) {}

  async execute(year?: number): Promise<PaymentInfos> {
    const payments = await this.paymentRepository.getAll(year);
    let months: any = {}

    for (let i = 1; i < 13; i++) {
      months[i] = 0;
    }

    const totalAmount = payments?.reduce((total, { value }) => {
      return total + Number(value)
    }, 0) || 0;

    payments.forEach(payment => {
      const paymentDate = new Date(payment.date);
      months[paymentDate.getMonth() + 1] += Number(payment.value);
    });
    
    return {
      totalAmount,
      amountByMonth: months
    };
  }
}