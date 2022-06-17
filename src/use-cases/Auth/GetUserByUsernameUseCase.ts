import { AuthRepository } from "../../repositories/AuthRepository";

export class GetUserByUsernameUseCase {

  constructor(
    private authRepository: AuthRepository
  ) {}

  async execute(userUsername: string) {
    return await this.authRepository.getByUsername(userUsername);
  }
}