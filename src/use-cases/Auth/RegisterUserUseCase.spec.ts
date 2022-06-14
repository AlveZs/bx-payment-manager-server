import { RegisterUserUseCase } from "./RegisterUserUseCase";

const RegisterUserSpy = jest.fn();

const registerUse = new RegisterUserUseCase(
    { 
      register: RegisterUserSpy,
      delete: jest.fn(),
      getByUsername: jest.fn(),
      getByUuid: jest.fn(),
      update: jest.fn(),
    },
);

describe('Register user customer', () => {
  it('should be able to create a user', async () => {
    await expect(registerUse.execute({
      name: "João Victor",
      username: "alvezs",
      password: "123456789",
      confirmPassword: "123456789",
      email: "alvezs@email.com"
    })).resolves.not.toThrow();

    expect(RegisterUserSpy).toHaveBeenCalled();
  });

  it('should not be able to register with password mismatch', async () => {
    await expect(registerUse.execute({
      name: "João Victor",
      username: "alvezs",
      password: "123456",
      confirmPassword: "123456789",
      email: "alvezs@email.com"
    })).rejects.toThrow();
  });

  it('should not be able to register without required fields', async () => {
    await expect(registerUse.execute({
      name: "João Victor",
      username: "alvezs",
      password: "",
      confirmPassword: "",
    })).rejects.toThrow();
  });
});