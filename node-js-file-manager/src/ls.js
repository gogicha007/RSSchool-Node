import { readdir } from 'node:fs/promises';

export const ls = async (currentFolder) => {
  let folder = currentFolder;
  try {
    const files = await readdir(folder, { withFileTypes: true });
    const justFolders = files
      .filter((file) => file.isDirectory())
      .sort((a, b) => a.name.localeCompare(b.name));
    const justFiles = files
      .filter((file) => file.isFile())
      .sort((a, b) => a.name.localeCompare(b.name));

    const list = justFolders.concat(justFiles).reduce((acc, val) => {
      acc.push({
        name: val.name,
        type: val.isFile() ? 'file' : 'directory',
      });
      return acc;
    }, []);
    console.table(list);
  } catch (err) {
    console.error('Operation fail ', err);
  } finally {
    console.log(`\nYou are currently in ${currentFolder}`);
  }
};
