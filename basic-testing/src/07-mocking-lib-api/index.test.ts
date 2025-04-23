// Uncomment the code below and write your tests
import axios, { AxiosInstance } from 'axios';
import { throttledGetDataFromApi } from './index';

jest.mock('axios');
jest.mock('lodash', () => ({
  throttle: jest.fn((fn) => fn),
}));

describe('throttledGetDataFromApi', () => {
  let mockResp: {data: string};
  let axiosInstance: AxiosInstance;
  let relativePath: string;
  beforeEach(() => {
    mockResp = { data: 'some data' };
    axiosInstance = {
      get: jest.fn().mockResolvedValue(mockResp),
    } as any as AxiosInstance;
    jest.spyOn(axios, 'create').mockReturnValue(axiosInstance);
    relativePath = '/users';
  });

  test('should create instance with provided base url', async () => {
    await throttledGetDataFromApi(relativePath);
    expect(axios.create).toHaveBeenCalledWith({
      baseURL: 'https://jsonplaceholder.typicode.com',
    });
  });

  test('should perform request to correct provided url', async () => {
    await throttledGetDataFromApi(relativePath);
    expect(axiosInstance.get).toHaveBeenCalledWith(relativePath);
  });

  test('should return response data', async () => {
    const result = await throttledGetDataFromApi(relativePath);
    expect(result).toEqual(mockResp.data);
  });
});
