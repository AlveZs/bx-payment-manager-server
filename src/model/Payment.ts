import { Customer } from "./Customer";

export interface Payment {  
  date: Date;
  value: number;
  customerId: number;
  customer: Customer;
}