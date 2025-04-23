import fs from 'fs';
import path from 'path';
import zlib from 'zlib';
import { pipeline } from 'stream/promises';

const compress = async () => {
  const srcFile = path.join(process.cwd(), 'files', 'fileToCompress.txt');
  const zipFile = path.join(process.cwd(), 'files', 'archive.gz');

  await pipeline(
    fs.createReadStream(srcFile),
    zlib.createGzip(),
    fs.createWriteStream(zipFile)
  );
};

await compress();
