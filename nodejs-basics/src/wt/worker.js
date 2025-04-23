import { workerData, parentPort } from 'worker_threads';

const nthFibonacci = (n) =>
  n < 2 ? n : nthFibonacci(n - 1) + nthFibonacci(n - 2);

const sendResult = () => {
  let status, data;
  try {
    data = nthFibonacci(workerData.fNumber);
    status = 'resolved';
  } catch (error) {
    status = 'error';
    data = null;
  }
  parentPort.postMessage({ status: status, data: data });
};

sendResult();
