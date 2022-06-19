import { CustomerRepository } from "../../repositories/CustomerRepository";
import { PaymentRepository } from "../../repositories/PaymentRepository";

export interface AmountByMonth {
  month: number,
  amount: number
}

export interface DashboardInfos {
  totalCustomers: number;
  totalDebtors: number;
  totalAmount: number;
  totalAmountCurrentMonth: number;
  amountByMonth: AmountByMonth;
}

export class DashboardInfosUseCase {

  constructor(
    private paymentRepository: PaymentRepository,
    private customerRepository: CustomerRepository
  ) {}

  async execute(userId: number, year?: number): Promise<DashboardInfos> {
    const CURRENT_DATE = new Date();
    const payments = await this.paymentRepository.getAll(userId, year);
    const customers = await this.customerRepository.getAll(userId);

    let months: any = {}

    for (let i = 1; i < 13; i++) {
      months[i] = 0;
    }

    const activeCustomers = customers.filter(customer => customer.deleted === null);

    const totalDebtors = activeCustomers.filter(customer => {
      const lastPayment = customer.Payments ? customer.Payments[0] : null;
      if (lastPayment) {
        const paymentDate = new Date(lastPayment.date);
        return paymentDate.getMonth() !== CURRENT_DATE.getMonth() &&
          paymentDate.getFullYear() === CURRENT_DATE.getFullYear()
      } else {
        return false;
      }
    }).length;

    const totalAmount = payments?.reduce((total, { value }) => {
      return total + Number(value)
    }, 0) || 0;

    const totalAmountCurrentMonth = payments?.filter(
        payment => new Date(payment.date).getMonth() === new Date().getMonth()
      ).reduce((total, { value }) => {
        return total + Number(value)
      }, 0) || 0;

    payments.forEach(payment => {
      const paymentDate = new Date(payment.date);
      months[paymentDate.getMonth() + 1] += Number(payment.value);
    });
    
    return {
      totalCustomers: activeCustomers.length,
      totalDebtors,
      totalAmount,
      totalAmountCurrentMonth,
      amountByMonth: months
    };
  }
}