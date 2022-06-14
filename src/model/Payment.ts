import { Customer } from "./Customer";

export interface Payment {
  id?: number;
  uuid?: string;
  date: Date;
  value: number;
  customerId: number;
  Customer: Customer;
  description?: string;
  type?: string;
}