// Uncomment the code below and write your tests
import {
  getBankAccount,
  InsufficientFundsError,
  SynchronizationFailedError,
  TransferFailedError,
} from '.';

describe('BankAccount', () => {
  const initialBalance = 1000;
  const myAccount = getBankAccount(initialBalance);
  const otherAccount = getBankAccount(initialBalance);
  test('should create account with initial balance', () => {
    expect(myAccount.getBalance()).toBe(initialBalance);
  });

  test('should throw InsufficientFundsError error when withdrawing more than balance', () => {
    expect(() => myAccount.withdraw(2000)).toThrow(InsufficientFundsError);
  });

  test('should throw error when transferring more than balance', () => {
    expect(() => myAccount.transfer(2000, otherAccount)).toThrow(
      InsufficientFundsError,
    );
  });

  test('should throw error when transferring to the same account', () => {
    expect(() => myAccount.transfer(2000, myAccount)).toThrow(
      TransferFailedError,
    );
  });

  test('should deposit money', () => {
    const initAmnt = myAccount.getBalance();
    const depositAmnt = 2000;
    expect(myAccount.deposit(depositAmnt).getBalance()).toBe(
      initAmnt + depositAmnt,
    );
  });

  test('should withdraw money', () => {
    const initAmnt = myAccount.getBalance();
    const withdrawAmnt = 500;
    expect(myAccount.withdraw(withdrawAmnt).getBalance()).toBe(
      initAmnt - withdrawAmnt,
    );
  });

  test('should transfer money', () => {
    const initAmnt = myAccount.getBalance();
    const otherAccBalance = otherAccount.getBalance();
    const sentAmnt = 500;
    expect(myAccount.transfer(sentAmnt, otherAccount).getBalance()).toBe(
      initAmnt - sentAmnt,
    );
    expect(otherAccount.getBalance()).toBe(otherAccBalance + sentAmnt);
  });

  test('fetchBalance should return number in case if request did not failed', async () => {
    const data = await myAccount.fetchBalance();
    if (data) expect(typeof data).toBe('number');
  });

  test('should set new balance if fetchBalance returned number', async () => {
    jest.spyOn(myAccount, 'fetchBalance').mockResolvedValue(2000);
    await myAccount.synchronizeBalance();
    expect(myAccount.getBalance()).toBe(2000);
  });

  test('should throw SynchronizationFailedError if fetchBalance returned null', async () => {
    jest.spyOn(myAccount, 'fetchBalance').mockResolvedValue(null);
    await expect(myAccount.synchronizeBalance()).rejects.toThrow(
      SynchronizationFailedError,
    );
  });
});
