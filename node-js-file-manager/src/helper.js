import path from 'node:path';

export const buildPath = (argPath, currentFolder) => {
  let folder = argPath;
  if (!path.isAbsolute(argPath)) {
    folder = path.join(currentFolder, argPath);
  }
  return folder;
};
