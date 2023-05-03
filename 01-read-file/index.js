const { createReadStream } = require('fs');
const path = require('path');
const { stdout } = process;
const readStream = createReadStream(path.join(__dirname, 'text.txt'));
readStream.on('data', data => stdout.write(data));
readStream.on('error', err => console.log(err.message));
