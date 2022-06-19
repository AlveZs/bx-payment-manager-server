import { parse } from "csv-parse";
import { Response } from "express";
import { finished } from "stream/promises";
import { Customer } from "../../model/Customer";
import { CustomerCreateData, CustomerRepository } from "../../repositories/CustomerRepository";
export interface CsvResult {
  number: string;
  name: string;
  1: string;
  2: string;
  3: string;
  4: string;
  5: string;
  6: string;
  7: string;
  8: string;
  9: string;
  10: string;
  11: string;
  12: string;
}

export interface PaymentCreate {
  date: Date | string;
  value: number;
}


export class ImportCsvUseCase {

  constructor(
    private customerRepository: CustomerRepository,
  ) { }

  async execute(
    data: Buffer,
    response: Response,
    userId: number,
    delimiter?: string
  ): Promise<Customer[]> {
    const headers = ['number', 'name', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];

    let customers: CustomerCreateData[] = []
    const currentDate = new Date();


    const records: CsvResult[] = [];

    const parser = parse(data, {
        delimiter,
        columns: headers,
        from_line: 2,
      });

    parser.on('readable', function () {
      let record;
      while ((record = parser.read()) !== null) {
        records.push(record);
      }
    });

    parser.on('error', function (err) {
      console.error(err.message);
      return response.sendStatus(500);
    });

    await finished(parser);

    customers = records.map((line: CsvResult) => {
      const { name, number } = line;

      const payments: (PaymentCreate | null)[] = Object.entries(line).map(([key, lineValue]) => {
        const amountValue = Number(lineValue.replace(',', '.'));
        if (!isNaN(Number(key)) && !isNaN(amountValue) && amountValue > 0) {
          return {
            date: new Date(currentDate.getFullYear(), Number(key) - 1, 1),
            value: amountValue,
          } as PaymentCreate
        }

        return null;
      });

      const paymentsFiltered: PaymentCreate[] = payments.filter((payment): payment is PaymentCreate => payment !== null);

      const customer: CustomerCreateData = {
        name,
        number: Number(number),
        password: '1234',
        userName: `${name.toLowerCase()
          .split(' ')
          .join('_')}${String(number).padStart(4, '0')
          }`,
        Payments: {
          createMany: {
            data: paymentsFiltered
          }
        },
        userId
      };

      return customer
    });

    this.customerRepository.createMultipleWithPayments(customers as CustomerCreateData[]);

    return customers as Customer[];
  }
}