const fs = require('fs');
const { promises } = fs;
const path = require('path');

function createDirectory() {
  const distPath = path.resolve(__dirname, 'project-dist');
  promises.mkdir(distPath, { recursive: true });
}

function createHTML() {
  const inputPath = path.resolve(__dirname, 'template.html');
  const inputStream = fs.createReadStream(inputPath, 'utf-8');
  const outputPath = path.resolve(__dirname, 'project-dist', 'index.html');
  inputStream.on('data', data => {
    let htmlToString = data.toString();

    const componentPath = path.resolve(__dirname, 'components');
    const componentsInFolder = promises.readdir(componentPath, { withFileTypes: true });
    componentsInFolder.then(files => files.forEach(file => {
        
      if (file.isFile()) {
        const filePath = path.resolve(__dirname, 'components', file.name);
        const fileName = path.basename(filePath);
        const ext = path.extname(filePath);
        const onlyName = fileName.replace(ext, '');
        const inputStream = fs.createReadStream(filePath, 'utf-8');
        inputStream.on('data', data => {
          const outputStream = fs.createWriteStream(outputPath);
          const component = data.toString();
          htmlToString = htmlToString.replace(`{{${onlyName}}}`, component);
          outputStream.write(htmlToString);
        })
      }
    }));
  }) 
}

function createCSS() {
  const stylesPath = path.resolve(__dirname, 'styles');
  const stylesInFolder = promises.readdir(stylesPath, { withFileTypes: true });
  const bundlePath = path.resolve(__dirname, 'project-dist', 'style.css');
  const outputStream = fs.createWriteStream(bundlePath);
  stylesInFolder.then(files => files.forEach(file => {

    if (file.isFile()) {
      const filePath = path.resolve(__dirname, 'styles', file.name);
      const ext = path.extname(filePath);

      if (ext === '.css') {
        const inputStream = fs.createReadStream(filePath, 'utf-8');
        inputStream.on('data', data => {
          outputStream.write(data.toString() + '\n');
        }) 
      }
    }
  }));
}

function copyAssets(dirPath, copyDirPath) {
  let folderPath = '';
  let copyFolderPath = '';

  if (!dirPath && !copyDirPath) {
    folderPath = path.resolve(__dirname, 'assets');
    copyFolderPath = path.resolve(__dirname, 'project-dist', 'assets');
  } else {
    folderPath = dirPath;
    copyFolderPath = copyDirPath;
  }
  promises.mkdir(copyFolderPath, { recursive: true });
  const filesInFolder = promises.readdir(folderPath, { withFileTypes: true });
  filesInFolder.then(files => files.forEach(file => {
    const filePath = path.resolve(folderPath, file.name);
    const copyFilePath = path.resolve(copyFolderPath, file.name);

    if (file.isFile()) {
      promises.copyFile(filePath, copyFilePath);
    } else if (file.isDirectory()) {
      folderPath = path.resolve(__dirname, 'assets', file.name);
      copyFolderPath = path.resolve(__dirname, 'project-dist', 'assets', file.name);
      copyAssets(folderPath, copyFolderPath);
    }
  }));
}

function clearAssets() {
  const copyFolderPath = path.resolve(__dirname, 'project-dist', 'assets');
  fs.rm(copyFolderPath, { recursive: true, force: true }, (err) => {

    if (err) {
      console.error(err.message);
      return;
    }
    copyAssets();
  });
}

function generateBundle() {
  createDirectory();
  createCSS();
  createHTML();
  clearAssets();
  console.log('*****The bundle has been created*****');
};

generateBundle();


