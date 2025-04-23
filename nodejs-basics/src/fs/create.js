import fs from 'fs';
import { existsSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const create = async () => {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);

  const content = 'I am fresh and young';
  const errMessage = 'FS operation failed';
  const fileName = path.join(__dirname, 'files/fresh.txt');

  if (existsSync(fileName)) {
    throw new Error(errMessage);
  } else {
    fs.writeFile(fileName, content, (err) => {
      if (err) console.error(errMessage);
    });
  }
};

await create();
