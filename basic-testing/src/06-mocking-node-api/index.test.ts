// Uncomment the code below and write your tests
import { readFileAsynchronously, doStuffByTimeout, doStuffByInterval } from '.';
import path from 'path';
import fs from 'fs';

describe('doStuffByTimeout', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  test('should set timeout with provided callback and timeout', () => {
    const callBack = jest.fn();
    const timeOut = 1000;

    jest.spyOn(global, 'setTimeout');

    doStuffByTimeout(callBack, timeOut);

    expect(setTimeout).toHaveBeenCalledWith(callBack, timeOut);
  });

  test('should call callback only after timeout', () => {
    const callBack = jest.fn();
    const timeOut = 1000;

    doStuffByTimeout(callBack, timeOut);

    expect(callBack).not.toHaveBeenCalled();

    jest.runAllTimers();

    expect(callBack).toHaveBeenCalledTimes(1);
  });
});

describe('doStuffByInterval', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  test('should set interval with provided callback and timeout', () => {
    const callBack = jest.fn();
    const interval = 1000;

    jest.spyOn(global, 'setInterval');

    doStuffByInterval(callBack, interval);

    expect(setInterval).toHaveBeenCalledWith(callBack, interval);
  });

  test('should call callback multiple times after multiple intervals', () => {
    const callBack = jest.fn();
    const interval = 1000;

    doStuffByInterval(callBack, interval);

    jest.advanceTimersByTime(interval);
    expect(callBack).toBeCalledTimes(1);

    jest.advanceTimersByTime(interval);
    expect(callBack).toBeCalledTimes(2);

    jest.advanceTimersByTime(interval);
    expect(callBack).toBeCalledTimes(3);
  });
});

describe('readFileAsynchronously', () => {
  test('should call join with pathToFile', async () => {
    const spyOnJoin = jest.spyOn(path, 'join');
    const filePath = 'file.txt';
    await readFileAsynchronously(filePath);
    expect(spyOnJoin).toHaveBeenCalledWith(__dirname, filePath);
    spyOnJoin.mockRestore();
  });

  test('should return null if file does not exist', async () => {
    jest.spyOn(fs, 'existsSync').mockReturnValue(false)
    const filePath = 'index.ts'
    const theFile = await readFileAsynchronously(filePath)
    expect(theFile).toBeNull()
  });

  test('should return file content if file exists', async () => {
    const filePath = 'index.ts'
    const fileContent = 'lorem ipsum dolor'

    jest.spyOn(fs, 'existsSync').mockReturnValue(true)
    jest.spyOn(fs.promises, 'readFile').mockResolvedValue(fileContent)
    
    const result = await readFileAsynchronously(filePath)
    expect(result).toBe(fileContent)
  });
});
