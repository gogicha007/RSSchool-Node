import fs from 'fs';
import path from 'path';

const copy = async () => {
  const __dirname = process.cwd();
  const srcFolder = path.join(__dirname, 'files');
  const destFolder = path.join(__dirname, 'files-copy');

  if (!fs.existsSync(srcFolder)) {
    throw new Error('FS operation failed')
  }

  fs.mkdir(destFolder, { recursive: false }, (err) => {
    if(err){
        throw new Error('FS operation failed')
    }
    fs.promises // remove contend of dest folder
      .readdir(destFolder)
      .then((files) => {
        for (const file of files) {
          fs.unlink(path.join(destFolder, file), (err) => {
            if (err) throw err;
          });
        }
      });
    fs.promises
      .readdir(srcFolder, { withFileTypes: true })
      .then((files) => {
        for (const file of files) {
          if (file.isFile()) {
            fs.copyFile(
              path.join(srcFolder, file.name),
              path.join(destFolder, file.name),
              (err) => {
                if (err) handleError(err);
              }
            );
          }
        }
      })
      .catch((err) => {throw new Error(err)});
  });

  function handleError(err) {
    console.log(err);
  }
};

await copy();
