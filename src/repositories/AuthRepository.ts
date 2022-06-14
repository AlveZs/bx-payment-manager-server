import { User } from "@prisma/client";

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
}

export interface UserLoginResponse {
  token: string
}

export interface AuthRepository {
  register: (data: RegisterUserUseCaseRequest) => Promise<void>;
  update: (userUuid: string, data: UpdateUserUseCaseRequest) => Promise<void>;
  delete: (userUuid: string) => Promise<void>;
  getByUuid: (userUuid: string) => Promise<User | null>;
  getByUsername: (username: string) => Promise<User | null>;
}