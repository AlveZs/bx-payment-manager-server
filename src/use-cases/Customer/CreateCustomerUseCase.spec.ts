import { CreateCustomerUseCase } from "./CreateCustomerUseCase";

const createCustomerSpy = jest.fn();

const createCustomer = new CreateCustomerUseCase(
    { 
      create: createCustomerSpy,
      delete: jest.fn(),
      getAll: jest.fn(),
      getByUuid: jest.fn(),
      update: jest.fn(),
    },
);

describe('Create customer', () => {
  it('should be able to create a customer', async () => {
    await expect(createCustomer.execute({
      name: 'João Alves',
      number: 123,
      userName: 'alvezs',
      password: '123456',
      userId: 1
    })).resolves.not.toThrow();

    expect(createCustomerSpy).toHaveBeenCalled();
  });

  it('should not be able to create a customer without required fields', async () => {
    await expect(createCustomer.execute({
      name: 'João Alves',
      number: 123,
      userName: '',
      password: '',
      userId: 1
    })).rejects.toThrow();
  });
});