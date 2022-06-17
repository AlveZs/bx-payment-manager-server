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

  async updateRefreshTokens(
    userUuid: string,
    refreshTokens: string[]
  ) {
    await prisma.user.update(
      {
        where: {
          uuid: userUuid,
        },
        data: {
          RefreshTokens: {
            deleteMany: {},
            createMany: {
              data: refreshTokens.map(token => ({ id: token })),
            },
          }
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

  async getUserByRefreshToken(refreshToken: string): Promise<User | null> {
    const user = await prisma.user.findFirst({
      where: {
        RefreshTokens: {
          some: {
            id: refreshToken,
          }
        },
      },
    });

    return user;
  }

  async getByUsername(username: string): Promise<User | null> {
    const user = await prisma.user.findUnique({
      where: {
        username,
      },
      include: {
        RefreshTokens: true,
      }
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