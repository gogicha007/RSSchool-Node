import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';
import { pipeline } from 'node:stream/promises';
import { stat } from 'node:fs/promises';
import { buildPath } from './helper.js';

export const compress = async (props, currentFolder) => {
  try {
    const srcFile = buildPath(props[0], currentFolder);
    const srcStats = await stat(srcFile);
    if (!srcStats.isFile()) throw new Error('Please enter valid file name...');
    let destFile;
    if (props[1]) {
      const destPath = buildPath(props[1], currentFolder);
      const destStats = await stat(destPath);
      if (!destStats.isDirectory())
        throw new Error('Please enter valid folder name...');
      destFile = path.join(destPath, `${path.basename(srcFile)}.br`);
    } else {
      destFile = path.join(currentFolder, `${path.basename(srcFile)}.br`);
    }
    await pipeline(
      fs.createReadStream(srcFile),
      zlib.createBrotliCompress(),
      fs.createWriteStream(destFile)
    );
  } catch (err) {
    console.error(err.message);
  } finally {
    console.log(`\nYou are currently in ${currentFolder}`);
  }
};

export const deCompress = async (props, currentFolder) => {
  try {
    const srcFile = buildPath(props[0], currentFolder);
    const srcStats = await stat(srcFile);
    const regex = /.br$/i;
    if (!srcStats.isFile() || !regex.test(srcFile))
      throw new Error('Please enter valid archive name...');
    let destFile;
    if (props[1]) {
      const destPath = buildPath(props[1], currentFolder);
      const destStats = await stat(destPath);
      if (!destStats.isDirectory())
        throw new Error('Please enter valid folder name...');
      destFile = path.join(
        destPath,
        `${path.basename(srcFile).replace('.br', '')}`
      );
    } else {
      destFile = path.join(
        currentFolder,
        `${path.basename(srcFile).replace('.br', '')}`
      );
    }
    await pipeline(
      fs.createReadStream(srcFile),
      zlib.createBrotliDecompress(),
      fs.createWriteStream(destFile)
    );
  } catch (err) {
    console.error('Operation fail ,', err.message);
  } finally {
    console.log(`\nYou are currently in ${currentFolder}`);
  }
};
