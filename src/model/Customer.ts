import { Payment } from "./Payment";

export interface Customer {
  id: number;
  uuid: string;
  name: string;
  nickname: string | null;
  phone: string | null;
  number: number;
  userName: string;
  password: string;
  wifiPassword: string | null;
  address: string | null;
  userId: number;
  createdAt: Date;
  updatedAt: Date;
  deleted: Date | null;
  Payments?: Payment[];
}