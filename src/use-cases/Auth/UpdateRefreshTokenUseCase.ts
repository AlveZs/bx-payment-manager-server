import { ERRORS_MESSAGES } from "../../constants/Errors";
import { AuthRepository } from "../../repositories/AuthRepository";



export class UpdateRefreshTokenUseCase {

  constructor(
    private authRepository: AuthRepository
  ) {}

  async execute(userUuid: string, refreshTokens: string[]) {
    if (userUuid) {
      await this.authRepository.updateRefreshTokens(userUuid, refreshTokens);
    } else {
      throw new Error(ERRORS_MESSAGES.USER_NOT_FOUND);
    }
  }
}