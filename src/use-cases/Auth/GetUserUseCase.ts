import { AuthRepository } from "../../repositories/AuthRepository";

export class GetUserUseCase {

  constructor(
    private authRepository: AuthRepository
  ) {}

  async execute(userUuid: string) {
    return await this.authRepository.getByUuid(userUuid);
  }
}