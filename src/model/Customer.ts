import { Payment } from "./Payment";

export interface Customer {
  uuid: string;
  name: string;
  number: number;
  userName: string;
  password: string;
  wifiPassword?: string;
  address?: string;
  payments?: Payment[]
}