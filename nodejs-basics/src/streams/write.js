import fs from 'fs';
import path from 'path';

const write = async () => {
  const theFile = path.join(process.cwd(), 'files', 'fileToWrite.txt');

  const ws = fs.createWriteStream(theFile);
  
  process.stdin.on('data', (data) => {
    if (data.toString().includes('quit')) process.stdin.destroy();
    ws.write(data);
  });
};

await write();
