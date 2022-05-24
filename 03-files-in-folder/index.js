const fs = require('fs');
const path = require('path');

fs.readdir(
  path.join(__dirname, 'secret-folder'),
  { withFileTypes: true },
  (error, files) => {
    if (error) {
      console.error(error);
    } else {
      files.forEach((file) => {
        if (file.isFile()) {
          const filePath = path.join(__dirname, 'secret-folder', file.name);
          const fileName = file.name.split('.')[0];
          const fileExt = path.extname(filePath).slice(1);

          fs.stat(filePath, (error, stats) => {
            if (error) {
              console.error(error);
            } else {
              console.log(`${fileName} - ${fileExt} - ${stats.size / 1024}kb`);
            }
          });
        }
      });
    }
  }
);