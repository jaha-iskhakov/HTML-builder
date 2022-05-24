const fsPromises = require('fs/promises');
const fs = require('fs');
const path = require('path');

const styles = path.join(__dirname, 'styles');
const bundle = path.join(__dirname, 'project-dist', 'bundle.css');

let writeableStream = fs.createWriteStream(bundle);

fsPromises.readdir(styles, {withFileTypes: true})
    .then(files => {
        files.map(file => {
            if (file.isFile() && path.extname(file.name) === '.css') {
                let readableStream = fs.createReadStream(`${styles}${path.sep}${path.join(file.name)}`,'utf8');
                readableStream.pipe(writeableStream);
            }
        });
    });