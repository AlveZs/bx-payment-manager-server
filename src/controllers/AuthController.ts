import { Request, Response } from "express";
import { ERRORS_MESSAGES } from "../constants/Errors";
import { User } from "../model/User";
import { PrismaAuthRepository } from "../repositories/prisma/PrismaAuthRepository";
import { GetUserByRefreshTokenUseCase } from "../use-cases/Auth/GetUserByRefreshTokenUseCase";
import { GetUserUseCase } from "../use-cases/Auth/GetUserUseCase";
import { LoginUseCase } from "../use-cases/Auth/LoginUseCase";
import { RegisterUserUseCase } from "../use-cases/Auth/RegisterUserUseCase";
import { UpdateRefreshTokenUseCase } from "../use-cases/Auth/UpdateRefreshTokenUseCase";
import { UpdateUserUseCase } from "../use-cases/Auth/UpdateUserUseCase";

class AuthController {
  async login(request: Request, response: Response) {
    const {
      username,
      password
    } = request.body;
    const cookies = request.cookies;

    const prismaCustomerRepository = new PrismaAuthRepository();

    const loginUseCase = new LoginUseCase(
      prismaCustomerRepository
    );

    try {
      const loginData = await loginUseCase.execute({
        username,
        password
      }, cookies?.jwt);

      if (loginData.clearCookie) {
        response.clearCookie('jwt', {
          httpOnly: true,
          secure: true,
          sameSite: 'none'
        });
      }

      response.cookie('jwt', loginData.newRefreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        maxAge: 24 * 60 * 60 * 1000
      });

      return response.status(200).json({
        User: {
          name: loginData.userName,
          username: loginData.userUsername,
          email: loginData.userEmail || '',
        },
        accessToken: loginData.accessToken
      });

    } catch (error) {
      console.log(error);

      if (error instanceof Error) {
        let errorStatus = 400;
        if (error.message === ERRORS_MESSAGES.INVALID_CREDENTIALS) {
          errorStatus = 401;
        }
        return response.status(errorStatus).json({ message: error.message });
      }

      return response.status(500).send();
    }
  }

  async logout(request: Request, response: Response) {
    const cookies = request.cookies;
    if (!cookies?.jwt) {
      return response.sendStatus(204);
    }

    const prismaCustomerRepository = new PrismaAuthRepository();

    const getUserByRefreshTokenUseCase = new GetUserByRefreshTokenUseCase(
      prismaCustomerRepository
    );

    const updateRefreshTokenUseCase = new UpdateRefreshTokenUseCase(
      prismaCustomerRepository
    );

    try {
      const refreshToken = cookies.jwt;

      const foundUser = await getUserByRefreshTokenUseCase.execute(refreshToken);

      if (!foundUser) {
        response.clearCookie('jwt', { httpOnly: true, sameSite: 'none', secure: true });
        return response.sendStatus(204);
      }

      const newRefreshTokenArray = foundUser.RefreshTokens?.filter(token => token.id !== refreshToken)
        .map(token => token.id);

      if (newRefreshTokenArray && newRefreshTokenArray.length > 0) {
        updateRefreshTokenUseCase.execute(foundUser.uuid, newRefreshTokenArray);
      }

      response.clearCookie('jwt', { httpOnly: true, sameSite: 'none', secure: true });
      response.sendStatus(204);
    } catch (error) {
      console.log(error);
      return response.status(500).send();
    }
  }

  async getLoggedUser(request: Request, response: Response) {
    const { userUuid } = response.locals.jwtPayload;

    const prismaCustomerRepository = new PrismaAuthRepository();

    const getUserUseCase = new GetUserUseCase(
      prismaCustomerRepository
    );

    try {
      const user: User | null = await getUserUseCase.execute(userUuid);
      return response.status(200).json({
        User: user ? {
          name: user.name,
          username: user.username,
          email: user.email || '',
        } : null,
      });
    } catch (error) {
      console.log(error);
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
        return response.status(400).json({ message: error.message });
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
        return response.status(400).json({ message: error.message });
      }

      return response.status(500).send();
    }

    return response.status(200).send();
  }
}

export { AuthController };