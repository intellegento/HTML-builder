const fs = require('fs');
const promises = fs.promises;
const path = require('path');

const pathFolder = path.resolve(__dirname, 'secret-folder');
const objInFolder = promises.readdir(pathFolder, {withFileTypes: true});

console.log('Name - Ext - Size');

objInFolder.then(files => files.forEach(file => {
  if (file.isFile()) {
    const pathToFile = path.resolve(__dirname, 'secret-folder', file.name);
    const fileName = path.basename(pathToFile);
    const extFile = path.extname(pathToFile);
    const statFiles = promises.stat(pathToFile);
    
    statFiles.then(stat => {
      const name = fileName.replace(extFile, '');
      const ext = extFile.replace('.', '');
      const size = +(stat.size / 1024).toFixed(3);
      console.log(`${name} - ${ext} - ${size}kb`);
    })
  }
})
)