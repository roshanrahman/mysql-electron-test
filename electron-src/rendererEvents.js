const { ipcMain } = require("electron/main");
const {app} = require('electron');

const constants = require('../src/shared/constants');
const { getFilesInPath } = require("./utils");


ipcMain.on(constants.SET_CURRENT_DIR, (event, path) => {
    currentDir = path;
});


ipcMain.on(constants.LIST_FILES_IN_DIRECTORY, (event, path) => {
    console.log("RECEIVED CALL");
    const fileList = getFilesInPath(path);
        console.log({fileList});
    event.reply(constants.LIST_FILES_IN_DIRECTORY, fileList);
});

ipcMain.handle(constants.REQUEST_HOME_DIR, (event, args) => {
    return app.getPath('documents');
});

