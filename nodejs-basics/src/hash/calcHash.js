import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

const calculateHash = async () => {
  const theFile = path.join(
    process.cwd(),
    'files',
    'fileToCalculateHashFor.txt'
  );

  const hash = crypto.createHash('sha256');

  const input = fs.createReadStream(theFile);

  input.on('readable', () => {
    const data = input.read();
    if (data) {
      hash.update(data);
    } else {
      console.log(hash.digest('hex'));
    }
  });
};

await calculateHash();
