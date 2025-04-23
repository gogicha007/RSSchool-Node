import fs from 'fs';
import path from 'path';

const read = async () => {
  const theFile = path.join(
    process.cwd(),
    'files',
    'fileToRead.txt'
  );

  const rs = fs.createReadStream(theFile);
  rs.pipe(process.stdout)
};

await read();
