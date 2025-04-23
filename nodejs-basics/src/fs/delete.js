import fs from 'fs';
import path from 'path';

const remove = async () => {
  const __dirname = process.cwd();
  const srcFolder = path.join(__dirname, 'files');
  const theFile = path.join(srcFolder, 'fileToRemove.txt');

  fs.unlink(theFile, (err) => {
    if (err) {
      throw new Error('FS operation failed');
    }
  });
};

await remove();
