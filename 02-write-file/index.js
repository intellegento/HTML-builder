const fs = require('fs');
const path = require('path');
const { stdout, stdin } = process;
const { createInterface } = require('readline');

const createFile = path.join(__dirname, 'text.txt');

const readLine = createInterface({ 
    input: stdin, 
    output: stdout 
});

const outputFile = fs.createWriteStream(createFile, 'utf-8');

function endProgram() {
    readLine.close();
    outputFile.end();
    stdout.write('Bye!\n');
}

readLine.write('Hi! \nYou can input your text here:\n');
readLine.on('SIGINT', () => endProgram());
readLine.on('line', data => {
    data.trim().toLowerCase() === 'exit' ? endProgram() : outputFile.write(data + '\n');
});
