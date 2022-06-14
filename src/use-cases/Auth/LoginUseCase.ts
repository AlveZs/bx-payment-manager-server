import { ERRORS_MESSAGES } from "../../constants/Errors";
import { AuthRepository } from "../../repositories/AuthRepository";
import { isNullOrEmpty } from "../../utils/Validator";
import { compare } from "bcrypt";
import { sign }  from "jsonwebtoken";


export interface RegisterUserUseCaseRequest {
  username: string;
  password: string;
}

export class LoginUseCase {

  constructor(
    private authRepository: AuthRepository
  ) {}

  async execute(request: RegisterUserUseCaseRequest) {
    const {
      username,
      password,
    } = request;

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
      const token = sign(
        { userId: existentUser.id, userUuid: existentUser.uuid },
        process.env.TOKEN_KEY as string,
        {
          expiresIn: '2h',
        }
      );

      return token
    }

    throw new Error(ERRORS_MESSAGES.INVALID_CREDENTIALS);
  }
}