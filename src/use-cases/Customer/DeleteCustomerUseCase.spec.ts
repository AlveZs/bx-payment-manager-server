import { DeleteCustomerUseCase } from "./DeleteCustomerUseCase";

const deleteCustomerSpy = jest.fn();

const deleteCustomer = new DeleteCustomerUseCase(
    { 
      create: jest.fn(),
      delete: deleteCustomerSpy,
      getAll: jest.fn(),
      getByUuid: jest.fn(),
      update: jest.fn(),
      createMultipleWithPayments: jest.fn(),
    },
);

describe('Delete customer', () => {
  it('should be able to delete a customer', async () => {
    await expect(deleteCustomer.execute(1, 'uuid')).resolves.not.toThrow();

    expect(deleteCustomerSpy).toHaveBeenCalled();
  });
});