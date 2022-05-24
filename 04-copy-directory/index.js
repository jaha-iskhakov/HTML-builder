const fs = require('fs');
const path = require('path');
const dirOne = path.join(__dirname, 'files');
const dirTwo = path.join(__dirname, 'files-copy');

function errorHandler(err) {if (err) throw err};

fs.mkdir(dirTwo, {recursive: true}, errorHandler); 

fs.readdir(dirOne, (err, files) => {
    if (err) throw err;
    else files.forEach(el => {
        fs.copyFile(path.join(dirOne, el), path.join(dirTwo, el), errorHandler);
    });
});

fs.readdir(dirTwo, (err, newFiles) => {
    errorHandler(err);
    fs.readdir(dirOne, (err, oldFiles) => {
        errorHandler(err);
        newFiles.forEach(file => {
            if (!oldFiles.includes(file)) fs.unlink(path.join(dirTwo, file), errorHandler);
        });
    });
});
