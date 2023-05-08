
const fs = require('fs');
const promises = fs.promises;
const path = require('path');
const pathFolder = path.resolve(__dirname, 'files');
const pathCopyFolder = path.resolve(__dirname, 'files-copy');

promises.mkdir(pathCopyFolder, { recursive: true });
const copyFolder = promises.readdir(pathCopyFolder);

function clearFolder() {
    copyFolder.then(files => files.forEach(file => {
      const pathToCopyFile = path.resolve(pathCopyFolder, file);
      promises.unlink(pathToCopyFile);
    })
    )
  }

clearFolder();

const objInFolder = promises.readdir(pathFolder);

objInFolder.then(files => files.forEach(file => {
  const pathToFile = path.resolve(pathFolder, file);
  const pathToCopyFile = path.resolve(pathCopyFolder, file);
  promises.copyFile(pathToFile, pathToCopyFile);
})
)

console.log('*****Copy completed*****');