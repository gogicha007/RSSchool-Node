import fs from 'fs';
import path from 'path'

const read = async () => {
    const __dirname = process.cwd()
    const theFolder = path.join(__dirname, 'files')
    const theFile = path.join(theFolder, 'fileToRead.txt')
    
    fs.readFile(theFile, "utf-8", (err, data) => {
        if(err) {
            throw new Error('FS operation failed')
        }
        console.log(data)
    });

};

await read();