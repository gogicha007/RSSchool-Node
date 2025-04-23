import path from 'node:path';

export const goUp = (folder) => {
  const root = path.parse(folder).root;
  if (folder !== root) {
    process.chdir(path.dirname(folder));
    folder = process.cwd();
  } 
  return folder;
};
