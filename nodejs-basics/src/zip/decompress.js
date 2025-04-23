import fs from 'fs'
import path from 'path'
import zlib from 'zlib'

const decompress = async () => {
    const srcFile = path.join(process.cwd(), 'files', 'fileToCompress.txt')
    const zipFile = path.join(process.cwd(), 'files', 'archive.gz')
    
    const rsZipFile = fs.createReadStream(zipFile)
    const wsUnzipFile = fs.createWriteStream(srcFile)
    const unzip = zlib.createGunzip()

    rsZipFile.pipe(unzip).pipe(wsUnzipFile)

};

await decompress();