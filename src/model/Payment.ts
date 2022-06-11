import { Customer } from "./Customer";

export interface Payment {
  id?: number;
  uuid?: string;
  date: Date;
  value: number;
  customerId?: number;
  customer?: Customer;
  description?: string;
  type?: string;
}