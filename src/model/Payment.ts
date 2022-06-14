import { Decimal } from "@prisma/client/runtime";
import { Customer } from "./Customer";

export interface Payment {
  id: number;
  uuid: string;
  date: Date;
  value: Decimal;
  customerId: number;
  Customer?: Customer | null;
  description: string | null;
  type: string | null;
  createdAt: Date;
  updatedAt: Date;
}