import { RefreshToken } from "../model/RefreshToken";
import { User } from "../model/User";

export interface RegisterUserUseCaseRequest {
  name: string;
  username: string;
  password: string;
  email?: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface UpdateUserUseCaseRequest {
  name?: string;
  username?: string;
  password?: string;
  email?: string;
  RefreshTokens?: string[];
}

export interface UserLoginResponse {
  token: string
}

export interface AuthRepository {
  register: (data: RegisterUserUseCaseRequest) => Promise<void>;
  update: (userUuid: string, data: UpdateUserUseCaseRequest) => Promise<void>;
  updateRefreshTokens: (userUuid: string, refreshTokens: string[]) => Promise<void>;
  delete: (userUuid: string) => Promise<void>;
  getByUuid: (userUuid: string) => Promise<User | null>;
  getByUsername: (username: string) => Promise<User | null>;
  getUserByRefreshToken: (refreshToken: string) => Promise<User | null>;
}