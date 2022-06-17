import { User } from "./User";

export type RefreshToken = {
  id: string;
  userId: number;
  User?: User | null;
}