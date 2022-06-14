import { Payment } from "../model/Payment";

export interface PaymentCreateData {
  date: Date;        
  value: number;    
  type?: string;        
  description?: string;
}

export interface PaymentUpdateData {
  date: Date;        
  value: number;    
  type?: string;        
  description?: string; 
}

export interface PaymentRepository {
  create: (customerId: number, data: PaymentCreateData) => Promise<void>;
  update: (paymentUuid: string, data: PaymentUpdateData) => Promise<void>;
  delete: (paymentUuid: string) => Promise<void>;
  getByUuid: (paymentUuid: string) => Promise<Payment | null>;
  getAllByCostumerId: (
    customerId: number,
    year?: number,
    month?: number
  ) => Promise<Payment[] | null>;
  getAll: (userId: number, year?: number) => Promise<Payment[]>;
}