import { Request, Response } from "express";
import { ERRORS_MESSAGES } from "../constants/Errors";
import { PrismaAuthRepository } from "../repositories/prisma/PrismaAuthRepository";
import { LoginUseCase } from "../use-cases/Auth/LoginUseCase";
import { RegisterUserUseCase } from "../use-cases/Auth/RegisterUserUseCase";
import { UpdateUserUseCase } from "../use-cases/Auth/UpdateUserUseCase";

class AuthController {
  async login(request: Request, response: Response) {
    const {
      username,
      password
    } = request.body;

    const prismaCustomerRepository = new PrismaAuthRepository();

    const loginUseCase = new LoginUseCase(
      prismaCustomerRepository
    );

    try {
      const token = await loginUseCase.execute({
        username,
        password
      });

      return response.status(200).json({ token }).send();

    } catch (error) {
      if (error instanceof Error && Object.values(ERRORS_MESSAGES).includes(error.message)) {
        return response.status(400).json({ message: error.message }).send();
      }

      return response.status(500).send();
    }
  }

  async register(request: Request, response: Response) {
    const {
      name,
      username,
      password,
      confirmPassword,
      email,
    } = request.body

    const prismaAuthRepository = new PrismaAuthRepository();

    const registerUserCustomerUseCase = new RegisterUserUseCase(
      prismaAuthRepository
    );

    try {
      await registerUserCustomerUseCase.execute({
        name,
        username,
        password,
        confirmPassword,
        email,
      });
    } catch (error) {
      if (error instanceof Error && Object.values(ERRORS_MESSAGES).includes(error.message)) {
        return response.status(400).json({ message: error.message }).send();
      }

      return response.status(500).send();
    }

    return response.status(201).send();
  }

  async update(request: Request, response: Response) {
    const {
      name,
      username,
      password,
      confirmPassword,
      email,
    } = request.body

    const { userUuid } = response.locals.jwtPayload;

    const prismaAuthRepository = new PrismaAuthRepository();

    const updateUserUseCase = new UpdateUserUseCase(
      prismaAuthRepository
    );

    try {
      await updateUserUseCase.execute(
        userUuid,
        {
          name,
          username,
          password,
          confirmPassword,
          email
        }
      );
    } catch (error) {
      if (error instanceof Error && Object.values(ERRORS_MESSAGES).includes(error.message)) {
        return response.status(400).json({ message: error.message }).send();
      }

      return response.status(500).send();
    }

    return response.status(200).send();
  }
}

export { AuthController };