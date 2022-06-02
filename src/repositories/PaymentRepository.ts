import { Payment } from "@prisma/client";

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
  getAllByCostumerId: (customerId: number) => Promise<Payment[] | null>;
  getAll: () => Promise<Payment[]>;
}