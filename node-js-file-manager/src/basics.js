import {
  access,
  constants,
  open,
  rename,
  unlink,
  stat,
} from 'node:fs/promises';
import { pipeline } from 'node:stream';
import { stdout } from 'node:process';
import path from 'node:path';
import fs from 'node:fs';
import { buildPath } from './helper.js';

export const cat = async (prop, currentFolder) => {
  try {
    const filePath = buildPath(prop, currentFolder);
    await access(filePath);
    const rs = fs.createReadStream(filePath);
    rs.on('data', (chunk) => {
      stdout.write(chunk);
    });
    rs.on('end', () => {
      console.log(`\nYou are currently in ${currentFolder}`);
    });
  } catch (err) {
    console.error('Operation fail', err.message);
    console.log(`\nYou are currently in ${currentFolder}`);
  }
};
export const add = async (prop, currentFolder) => {
  let file;
  try {
    const filePath = buildPath(prop, currentFolder);
    file = await open(filePath, 'wx');
  } catch (err) {
    console.error('Operation fail', err.message);
  } finally {
    if (file) file.close();
  }
};
export const rn = async (props, currentFolder) => {
  try {
    if (props.length !== 2)
      throw new Error('Need two arguments: path_to_file new_filename');
    const newFile = path.basename(props[1]);
    await access(props[0]);
    rename(props[0], newFile);
  } catch (err) {
    console.log('Operation fail', err.message);
  } finally {
    console.log(`\nYou are currently in ${currentFolder}`);
  }
};
export const cp = async (props, currentFolder) => {
  try {
    if (props.length !== 2)
      throw new Error('Need two arguments: path_to_file path_to_new_directory');
    await access(props[0]);
    await access(props[1]);
    const destination = path.join(props[1], path.basename(props[0]));

    pipeline(
      fs.createReadStream(props[0]),
      fs.createWriteStream(destination),
      (err) => {
        if (err) console.log(err?.message);
      }
    );
    console.log('File copied...');
  } catch (err) {
    console.error('Operation fail', err.message);
  } finally {
    console.log(`\nYou are currently in ${currentFolder}`);
  }
};
export const mv = async (props, currentFolder) => {
  try {
    if (props.length !== 2)
      throw new Error('Need two arguments: path_to_file path_to_new_directory');
    await access(props[0]);
    await access(props[1]);
    const destination = path.join(props[1], path.basename(props[0]));

    const rs = fs.createReadStream(props[0]);
    const ws = fs.createWriteStream(destination);
    await pipeline(rs, ws, (err) => {
      if (err) console.log('pipeline', err.message);
    });
    console.log('File moved...');
    ws.on('close', async () => {
      await unlink(props[0]);
    });
  } catch (err) {
    console.error('Operation fail', err.message);
  } finally {
    console.log(`\nYou are currently in ${currentFolder}`);
  }
};
export const removeFile = async (prop, currentFolder) => {
  try {
    const filePath = buildPath(prop, currentFolder);
    await access(filePath, constants.R_OK);
    const fileStat = await stat(filePath);
    if (!fileStat.isFile()) throw new Error('Please enter valid file name...');
    await unlink(filePath);
    console.log('file removed...');
  } catch (err) {
    console.error('Operation fail, ', err.message);
  } finally {
    console.log(`\nYou are currently in ${currentFolder}`);
  }
};
