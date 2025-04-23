import fs from 'fs';
import path from 'path';

const list = async () => {
  const __dirname = process.cwd();
  const theFolder = path.join(__dirname, 'files');

  fs.promises.readdir(theFolder).then((files) => {
    console.log(files);
  }).catch(() => {throw new Error('FS operation failed')});
};

await list();
