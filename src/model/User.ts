import { RefreshToken } from "./RefreshToken";

export type User = {
  id: number;
  uuid: string;
  name: string;
  username: string;
  password: string;
  email: string | null;
  createdAt: Date;
  updatedAt: Date;
  RefreshTokens?: RefreshToken[];
}