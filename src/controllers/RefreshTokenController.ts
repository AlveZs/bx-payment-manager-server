import { Request, Response } from "express";
import { sign, verify } from "jsonwebtoken";
import { ERRORS_MESSAGES } from "../constants/Errors";
import { PrismaAuthRepository } from "../repositories/prisma/PrismaAuthRepository";
import { GetUserByRefreshTokenUseCase } from "../use-cases/Auth/GetUserByRefreshTokenUseCase";
import { GetUserByUsernameUseCase } from "../use-cases/Auth/GetUserByUsernameUseCase";
import { UpdateRefreshTokenUseCase } from "../use-cases/Auth/UpdateRefreshTokenUseCase";

class RefreshTokenController {
  async refreshTokenUpdate(request: Request, response: Response) {
    const cookies = request.cookies;

    const prismaCustomerRepository = new PrismaAuthRepository();

    const updateRefreshTokenUseCase = new UpdateRefreshTokenUseCase(
      prismaCustomerRepository
    );

    const getUserByRefreshTokenUseCase = new GetUserByRefreshTokenUseCase(
      prismaCustomerRepository
    );

    const getUserByUsernameUseCase = new GetUserByUsernameUseCase(
      prismaCustomerRepository
    );

    try {
      if (!cookies?.refreshToken) {
        return response.status(401).json({ message: 'UNAUTHORIZED' });
      }

      const refreshToken = cookies.refreshToken;

      response.clearCookie('refreshToken', {
        httpOnly: true,
        sameSite: 'none',
        secure: true
      });

      response.clearCookie('accessToken', {
        httpOnly: true,
        sameSite: 'none',
        secure: true
      });

      const foundUser = await getUserByRefreshTokenUseCase.execute(refreshToken);

      if (!foundUser) {
        verify(
          refreshToken,
          process.env.REFRESH_TOKEN_KEY as string,
          async (error: any, decoded: any) => {
            if (error) {
              return response.sendStatus(403);
            }
            const hackedUser = await getUserByUsernameUseCase.execute(decoded?.userUsername);
            if (hackedUser) {
              await updateRefreshTokenUseCase.execute(hackedUser?.uuid, []);
            }
          }
        );
        return response.sendStatus(403);
      }

      const newRefreshTokenArray = foundUser.RefreshTokens?.filter(token => token.id !== refreshToken)
        .map(token => token.id);

      verify(
        refreshToken,
        process.env.REFRESH_TOKEN_KEY as string,
        async (error: any, decoded: any) => {
          if (error) {
            if (newRefreshTokenArray) {
              await updateRefreshTokenUseCase.execute(foundUser.uuid, newRefreshTokenArray);
            }
          }

          if (error || (decoded && (foundUser.username !== decoded.userUsername))) {
            return response.status(401).json({ message: 'UNAUTHORIZED' });
          }

          if (decoded) {
            const accessToken = sign(
              {
                userUsername: decoded.userUsername,
                userId: decoded.userId,
                userUuid: decoded.userUuid
              },
              process.env.ACCESS_TOKEN_KEY as string,
              { expiresIn: process.env.ACCESS_TOKEN_EXPIRATION }
            );

            const newRefreshToken = sign(
              {
                userUsername: decoded.userUsername,
                userId: decoded.userId,
                userUuid: decoded.userUuid
              },
              process.env.REFRESH_TOKEN_KEY as string,
              { expiresIn: process.env.REFRESH_TOKEN_EXPIRATION }
            );

            const tokensForUpdate = newRefreshTokenArray ?
              [...newRefreshTokenArray, newRefreshToken] :
              [newRefreshToken];

            await updateRefreshTokenUseCase.execute(foundUser.uuid, tokensForUpdate);

            response.cookie('accessToken', accessToken, {
              httpOnly: true,
              secure: true,
              sameSite: 'none',
              maxAge: 24 * 60 * 60 * 1000
            });

            response.cookie('refreshToken', newRefreshToken, {
              httpOnly: true,
              secure: true,
              sameSite: 'none',
              maxAge: 24 * 60 * 60 * 1000
            });

            return response.status(200).json({ accessToken });
          }
        }
      )
    } catch (error) {
      if (error instanceof Error) {
        let errorStatus = 400;
        if (
          error.message === ERRORS_MESSAGES.UNAUTHORIZED ||
          error.message === ERRORS_MESSAGES.USER_NOT_FOUND
        ) {
          errorStatus = 400;
        } else if (error.message === ERRORS_MESSAGES.FORBIDDEN) {
          errorStatus = 403;
        }

        return response.status(errorStatus).json({ message: error.message });
      }

      return response.status(500).send();
    }
  }
}

export { RefreshTokenController };
