const fs = require('fs');
const fileExtension = require('file-extension');
const constants = require('../src/shared/constants');
const {app} = require('electron');

const getFilesInPath = (path) => {
    const fileList = [];
    fs.readdirSync(path).forEach(file => {
            const extension = fileExtension(file);
            if(constants.ACCEPTABLE_FILE_EXTENSIONS.some(item => 
                extension === item
            )) {
                fileList.push({
                    name: file, 
                    extension: extension
                });
            }
        });
        return fileList;
};

var currentDir = app.getPath('documents'); // by default 

module.exports = {
    getFilesInPath, currentDir
};