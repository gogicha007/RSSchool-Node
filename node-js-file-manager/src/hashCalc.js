import fs from 'node:fs';
import crypto from 'crypto';
import { access } from 'node:fs/promises';
import { finished } from 'node:stream/promises';
import { buildPath } from './helper.js';

export const hashCalc = async (prop, currentFolder) => {
  let input;
  try {
    const filePath = buildPath(prop, currentFolder);
    await access(filePath);
    const hash = crypto.createHash('sha256');
    input = fs.createReadStream(filePath);

    input.on('readable', () => {
      const data = input.read();
      if (data) {
        hash.update(data);
      } else {
        console.log(`\n${hash.digest('hex')}`);
      }
    });
  } catch (err) {
    console.error('Operation fail ,', err.message);
  } finally {
    await finished(input);
    console.log(`\nYou are currently in ${currentFolder}`);
  }
};
