import { Prisma, User } from "@prisma/client";
import { ERRORS_MESSAGES } from "../../constants/Errors";
import { prisma } from "../../prisma";
import { AuthRepository, RegisterUserUseCaseRequest, UpdateUserUseCaseRequest } from "../AuthRepository";

export class PrismaAuthRepository implements AuthRepository {

  async register({
    name,
    username,
    password,
    email,
  }: RegisterUserUseCaseRequest) {
    await prisma.user.create({
      data: {
        name,
        username,
        password,
        email,
      },
    });
  }

  async update(
    userUuid: string,
    {
      name,
      username,
      password,
      email,
    }: UpdateUserUseCaseRequest) {
    await prisma.user.update(
      {
        where: {
          uuid: userUuid,
        },
        data: {
          name,
          username,
          password,
          email,
        },
      }
    );
  }

  async getByUuid(userUuid: string): Promise<User | null> {
    const user = await prisma.user.findUnique({
      where: {
        uuid: userUuid,
      },
    });

    return user;
  }

  async getByUsername(username: string): Promise<User | null> {
    const user = await prisma.user.findUnique({
      where: {
        username,
      },
    });

    return user;
  }

  async delete(userUuid: string) {
    try {
      await prisma.user.delete({
        where: {
          uuid: userUuid,
        },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new Error(ERRORS_MESSAGES.USER_NOT_FOUND);
        }
      }

      throw error;
    }
  }
}