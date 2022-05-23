import { Customer } from "@prisma/client";

export interface CustomerCreateData {
  name: string;
  number: number;
  userName: string;
  password: string;
  wifiPassword?: string;
  address?: string;
}

export interface CustomerUpdateData {
  name: string;
  number: number;
  userName: string;
  password: string;
  wifiPassword?: string;
  address?: string;
}

export interface CustomerRepository {
  create: (data: CustomerCreateData) => Promise<void>;
  update: (customerUuid: string, data: CustomerUpdateData) => Promise<void>;
  delete: (customerUuid: string) => Promise<void>;
  getByUuid: (customerUuid: string) => Promise<Customer | null>;
  getAll: () => Promise<Customer[]>;
}