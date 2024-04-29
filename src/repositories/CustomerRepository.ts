import { CustomerFilter } from "../interfaces/CustomerFilter";
import { Customer } from "../model/Customer";

export interface CustomerCreateData {
  name: string;
  nickname?: string;
  number: number;
  userName: string;
  password: string;
  wifiPassword?: string;
  address?: string;
  phone?: string;
  userId: number;
  Payments?: any;
}

export interface CustomerUpdateData {
  name: string;
  nickname?: string;
  number: number;
  userName: string;
  password: string;
  wifiPassword?: string;
  address?: string;
  phone?: string;
}

export interface CustomerRepository {
  create: (data: CustomerCreateData) => Promise<void>;
  createMultipleWithPayments: (customersData: CustomerCreateData[]) => Promise<void>;
  update: (customerUuid: string, data: CustomerUpdateData) => Promise<void>;
  delete: (customerUuid: string) => Promise<void>;
  getByUuid: (customerUuid: string) => Promise<Customer | null>;
  getAll: (userId: number, filter: CustomerFilter) => Promise<Customer[]>;
}