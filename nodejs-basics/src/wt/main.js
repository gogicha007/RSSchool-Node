import { Worker } from 'worker_threads';
import path from 'path';
import OS from 'os'

const performCalculations = async () => {
  const wFile = path.join(process.cwd(), 'worker.js');
  const THREAD_COUNT = OS.cpus().length;
  const workerPromises = [];

  const createWorker = (n) => {
    return new Promise((resolve, reject) => {
      const worker = new Worker(wFile, {
        workerData: { fNumber: n },
      });

      worker.on('message', resolve);
      worker.on('error', reject)
    });
  };

  for (let i = 0; i < THREAD_COUNT; i++) {
    workerPromises.push(createWorker(10 + i));
  }

  const thread_results = await Promise.all(workerPromises);
  console.log(thread_results)
};

await performCalculations();