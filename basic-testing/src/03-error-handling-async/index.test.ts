// Uncomment the code below and write your tests
import { throwError, throwCustomError, resolveValue, rejectCustomError } from './index';

describe('resolveValue', () => {
  test('should resolve provided value', async () => {
    resolveValue(8).then((value) => {
      expect(value).toBe(8);
    });
  });
});

describe('throwError', () => {
  test('should throw error with provided message', () => {
    const msg = 'This is error';
    expect(() => throwError(msg)).toThrow(msg);
  });

  test('should throw error with default message if message is not provided', () => {
    expect(() => throwError()).toThrow('Oops!');
  });
});

describe('throwCustomError', () => {
  test('should throw custom error', () => {
    expect(()=> throwCustomError()).toThrow('This is my awesome custom error!')
  });
});

describe('rejectCustomError', () => {
  test('should reject custom error', async () => {
    expect(()=>rejectCustomError()).rejects.toThrow('This is my awesome custom error!')
  });
});
