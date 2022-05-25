const fs = require('fs');
const path = require('path');
const readline = require('readline');
const { stdin: input, stdout: output } = require('process');

const writer = new fs.WriteStream(path.join(__dirname, 'out.txt'), {encoding: 'utf-8'});

let rl = readline.createInterface({ input, output });

rl.question('file out.txt was created, write content: \n if you want end, write "exit"', (answer) => {
  if (answer === 'exit') {
    rl.close();
  } else {
    writer.write(answer + '\n');
  }
});

rl.on('line', (input) => {
  if (input === 'exit') {
    console.log('file out.txt was cloused, see you');
    rl.close();
  } else {
    writer.write(input + '\n');
  }
});

rl.on('SIGINT', () => {
  console.log('you touch "Ctrl + C"...');
  rl.close();
});