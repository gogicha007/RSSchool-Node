import fs from 'fs';
import path from 'path'

const rename = async () => {
    const __dirname = process.cwd()
    const srcFolder = path.join(__dirname, 'files')
    const srcFile = path.join(srcFolder, 'wrongFilename.txt')
    const destFile = path.join(srcFolder, 'properFilename.md')

    if (!fs.existsSync(srcFile) | fs.existsSync(destFile)){
        throw new Error('FS operation failed')
    }

    fs.rename(destFile, srcFile, (err) => {
        if(err) throw new Error(err);
    })

};

await rename();