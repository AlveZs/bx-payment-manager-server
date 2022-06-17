import { AuthRepository } from "../../repositories/AuthRepository";

export class GetUserByRefreshTokenUseCase {

  constructor(
    private authRepository: AuthRepository
  ) {}

  async execute(refreshToken: string) {
    return  await this.authRepository.getUserByRefreshToken(refreshToken);
  }
}