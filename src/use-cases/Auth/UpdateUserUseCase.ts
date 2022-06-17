import { ERRORS_MESSAGES } from "../../constants/Errors";
import { AuthRepository } from "../../repositories/AuthRepository";
import { hash, genSalt } from "bcrypt"


export interface UpdateUserUseCaseRequest {
  name?: string;
  username?: string;
  password?: string;
  confirmPassword?: string;
  email?: string;
}

export class UpdateUserUseCase {

  constructor(
    private authRepository: AuthRepository
  ) {}

  async execute(userUuid: string, request: UpdateUserUseCaseRequest) {
    const {
      name,
      username,
      password,
      confirmPassword,
      email,
    } = request;

    let dataForUpdate: UpdateUserUseCaseRequest = {
      email,
      name,
    };

    if (username) {
      const existentUser = await this.authRepository.getByUsername(username);
  
      if (existentUser && username !== existentUser.username) {
        throw new Error(ERRORS_MESSAGES.USER_ALREADY_EXISTS);
      }

      dataForUpdate.username = username;
    }

    if (password && confirmPassword) {
      if (password !== confirmPassword) {
        throw new Error(ERRORS_MESSAGES.CONFIRM_PASSWORD_MISMATCH);
      }
      
      const salt = await genSalt(Number(process.env.SALT));
      const encryptedPassword = await hash(password, salt);

      dataForUpdate.password = encryptedPassword;
    }


    await this.authRepository.update(userUuid, dataForUpdate);
  }
}