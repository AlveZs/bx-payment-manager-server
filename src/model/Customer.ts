import { Payment } from "./Payment";

export interface Customer {
  id?: number;
  uuid?: string;
  name: string;
  nickname?: string;
  phone?: string;
  number: number;
  userName: string;
  password: string;
  wifiPassword?: string;
  address?: string;
  Payments?: Payment[];
  userId: number;
}