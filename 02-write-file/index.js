const fs = require('fs');
const path = require('path');
const readline = require('readline');
const { stdin: input, stdout: output } = require('process');

const writer = new fs.WriteStream(path.join(__dirname, 'out.txt'), {encoding: 'utf-8'});

let rl = readline.createInterface({ input, output });

// Создаем файл, и пишем контент
rl.question('file out.txt was created, write content: \n if you want end, write "exit"', (answer) => {
  if (answer === 'exit') {
    rl.close();
  } else {
    writer.write(answer + '\n');
  }
});

// всё пишем в файл, проверяя не написано ли слово "exit".
rl.on('line', (input) => {
  if (input === 'exit') {
    rl.close();
  } else {
    writer.write(input + '\n');
  }
});

rl.on('SIGINT', () => {
  console.log('you touch "Ctrl + C"...');
  rl.close();
});