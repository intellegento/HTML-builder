const fs = require('fs');
const promises = fs.promises;
const path = require('path');

const pathFolder = path.resolve(__dirname, 'styles');
const objInFolder = promises.readdir(pathFolder, {withFileTypes: true});
const pathToBundle = path.resolve(__dirname, 'project-dist', 'bundle.css');
const output = fs.createWriteStream(pathToBundle);

objInFolder.then(files => files.forEach(file => {
  if (file.isFile()) {
    const pathToFile = path.resolve(__dirname, 'styles', file.name);
    const fileName = path.basename(pathToFile);
    const extFile = path.extname(pathToFile);
    if (extFile === '.css') {
      const input = fs.createReadStream(pathToFile, 'utf-8');
      input.on('data', data => {
        output.write(data.toString() + '\n');
      }) 
    }
  }
})
)
console.log('*****Done! You bundle.css has been created*****');
