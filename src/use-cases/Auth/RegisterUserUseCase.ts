import { ERRORS_MESSAGES } from "../../constants/Errors";
import { AuthRepository } from "../../repositories/AuthRepository";
import { isNullOrEmpty } from "../../utils/Validator";
import { hash, genSalt } from "bcrypt"


export interface RegisterUserUseCaseRequest {
  name: string;
  username: string;
  password: string;
  confirmPassword: string;
  email?: string;
}

export class RegisterUserUseCase {

  constructor(
    private authRepository: AuthRepository
  ) {}

  async execute(request: RegisterUserUseCaseRequest) {
    const {
      name,
      username,
      password,
      confirmPassword
    } = request;

    const requiredFieldsNull = [
      name,
      username,
      password,
      confirmPassword
    ].filter(isNullOrEmpty);

    if (requiredFieldsNull.length > 0) {
      throw new Error(ERRORS_MESSAGES.REQUIRED_ERROR);
    }

    if (password !== confirmPassword) {
      throw new Error(ERRORS_MESSAGES.CONFIRM_PASSWORD_MISMATCH);
    }

    const existentUser = await this.authRepository.getByUsername(username);

    if (existentUser) {
      throw new Error(ERRORS_MESSAGES.USER_ALREADY_EXISTS);
    }

    const salt = await genSalt(Number(process.env.SALT));
    const encryptedPassword = await hash(password, salt);

    await this.authRepository.register({
      name,
      username,
      password: encryptedPassword,
    });
  }
}