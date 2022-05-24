const fs = require('fs');
const path = require('path');
const fsPromises = require('fs/promises');
const projDir = path.join(__dirname, 'project-dist');
const templateFile = path.join(__dirname, 'template.html');
const componDir = path.join(__dirname, 'components');
const indexFile = path.join(projDir, 'index.html');
const stylesFolder = path.join(__dirname, 'styles');
const assetsFolder = path.join(__dirname, 'assets');
const newAssetsFolder = path.join(projDir, 'assets');

fs.stat(projDir, (err) => {
    if (err) {
        makeDir(projDir);
        createHTML(templateFile, componDir);
        mergeStyles(stylesFolder, projDir, 'style.css');
        copyDir(assetsFolder, newAssetsFolder);
    } else {
        createHTML(templateFile, componDir);
        mergeStyles(stylesFolder, projDir, 'style.css');
        copyDir(assetsFolder, newAssetsFolder);
    }
});
  
const makeDir = async (folder) => {
    fs.mkdir(path.join(folder), { recursive: true }, (err) => {if (err) throw err;});
};
const createHTML = async (folder, compFolder) => {
    const readTemplate = fs.createReadStream(folder, 'utf-8');
    readTemplate.on('data', (templateData) => {
            fs.readdir(compFolder, { withFileTypes: true }, (err, component) => {
            if (err) throw err;
            component.forEach((file) => {
                if (file.isFile() && path.extname(file.name) === '.html') {
                    const baseName = path.basename(file.name, path.extname(file.name));
                    const fileInner = fs.createReadStream(path.join(compFolder, file.name), 'utf-8');
                    const reg = RegExp(`{{${baseName}}}`, 'gi');
                    fileInner.on('data', (data) => {
                        templateData = templateData.replace(reg, data);
                        fs.writeFile(indexFile, templateData, (err) => {if (err) throw err});
                    });
                }
            });
        });
    });
};
  
const mergeStyles = async (src, dist, fileName) => {
    const files = await fsPromises.readdir(src, { withFileTypes: true });
    const styleFiles = files.filter((file) => {
        return file.isFile() || path.extname(file.name) === '.css';
    });
    const styleArr = await Promise.all(styleFiles.map((styleFile) => {
        return fsPromises.readFile(path.join(src, styleFile.name), 'utf-8');
    }));
    await fsPromises.writeFile(path.join(dist, fileName), styleArr.join('\n'));
};
  
const copyDir = async (firstDir, destDir) => {
    await fsPromises.rm(destDir, { recursive: true, force: true }, (err) => {
        if (err) console.error(err)
    });
    await fsPromises.mkdir(destDir);
  
    const files = await fsPromises.readdir(firstDir, { withFileTypes: true });
    files.forEach((file) => {
        let src = path.join(firstDir, file.name);
        let dest = path.join(destDir, file.name);
        if (file.isDirectory()) copyDir(src, dest);
        else fsPromises.copyFile(src, dest);
    });
};