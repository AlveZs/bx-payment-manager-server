import { ERRORS_MESSAGES } from "../../constants/Errors";
import { AuthRepository } from "../../repositories/AuthRepository";
import { isNullOrEmpty } from "../../utils/Validator";
import { compare } from "bcrypt";
import { sign }  from "jsonwebtoken";


export interface LoginUserUseCaseRequest {
  username: string;
  password: string;
}

export interface AccessTokeyPayload {
  userName: string;
  userId: string;
  userUuid: string;
}


export class LoginUseCase {

  constructor(
    private authRepository: AuthRepository
  ) {}

  async execute(request: LoginUserUseCaseRequest, jwtCookie?: string) {
    const {
      username,
      password,
    } = request;

    let clearCookie = false;

    const requiredFieldsNull = [
      username,
      password,
    ].filter(isNullOrEmpty);

    if (requiredFieldsNull.length > 0) {
      throw new Error(ERRORS_MESSAGES.REQUIRED_ERROR);
    }

    const existentUser = await this.authRepository.getByUsername(username);

    if (existentUser && (
      await compare(password, existentUser.password)
    )) {
      const accessToken = sign(
        {
          userUsername: existentUser.username,
          userId: existentUser.id,
          userUuid: existentUser.uuid
        },
        process.env.ACCESS_TOKEN_KEY as string,
        { expiresIn: process.env.ACCESS_TOKEN_EXPIRATION }
      );

      const newRefreshToken = sign(
        {
          userUsername: existentUser.username,
          userId: existentUser.id,
          userUuid: existentUser.uuid
        },
        process.env.REFRESH_TOKEN_KEY as string,
        { expiresIn: process.env.REFRESH_TOKEN_EXPIRATION }
      );

      let newRefreshTokenArray =
        !jwtCookie
          ? existentUser.RefreshTokens?.map(token => token.id)
          : existentUser.RefreshTokens?.filter(token => token.id !== jwtCookie).map(token => token.id);

      if (jwtCookie) {
        const refreshToken = jwtCookie;
        const foundToken = await this.authRepository.getUserByRefreshToken(refreshToken);

        if (!foundToken) {
          newRefreshTokenArray = [];
        }

        clearCookie = true;
      }

      const tokensForUpdate = newRefreshTokenArray ?
        [...newRefreshTokenArray, newRefreshToken] :
        [newRefreshToken];

      await this.authRepository.updateRefreshTokens(
        existentUser.uuid,
        tokensForUpdate
      );

      return {
        clearCookie,
        newRefreshToken,
        accessToken,
        userName: existentUser.name,
        userUsername: existentUser.username,
        userEmail: existentUser.email
      }
    }

    throw new Error(ERRORS_MESSAGES.INVALID_CREDENTIALS);
  }
}