// Modules to control application life and create native browser window
const {app, BrowserWindow, ipcMain} = require('electron')
const path = require('path')
const url = require('url');
const mysql = require('mysql');
let dbConnection = null; //initially
let mainWindow; //initally

function connectToDB({host, user, password, database}) {
  try {
    dbConnection = mysql.createConnection({
      host, user, password, database 
    });
    let error = null;
    dbConnection.connect((err) => {
      if(err) {
        // this means error
        error = err;
      }
      mainWindow.webContents.send('DB_CONNECTION_UPDATE', {
        status: error ? "ERROR" : "CONNECTED",
        error, 
        credentials: {
          host, user, database
        }
      });
      const queryString = `SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_TYPE='BASE TABLE' AND TABLE_SCHEMA='${database}';`;
      dbConnection.query(
        queryString
        , function (error, results, fields) {
        console.log({results});
        if (error) throw error;
        if(results) {
          mainWindow.webContents.send('DB_LIST_TABLES_QUERY_RESULT', {
            queryName: 'getTablesQuery',
            query: queryString, 
            error: error, 
            results: results
          });
        }
      });
    })
  } catch (error) {
    console.error({error});
  }
}

function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
        nodeIntegration: true,
        contextIsolation: false,
    //   preload: path.join(__dirname, 'preload.js')
    },
    icon: path.join(__dirname, 'assets/icon.png')
  })

  // and load the index.html of the app.
  const startUrl = process.env.ELECTRON_START_URL || url.format({
    pathname: path.join(__dirname, '/../build/index.html'),
    protocol: 'file:',
    slashes: true
});
mainWindow.loadURL(startUrl);

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()

  
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow()
  
  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.


ipcMain.on('SET_DB_CREDENTIALS', (event, data) => {
  console.log({data});
  connectToDB({host: data.host, user: data.username, password: data.password, database: data.dbname});
});

ipcMain.on('REFRESH_LIST_TABLES_QUERY', (event, data) => {
  if(dbConnection) {
    dbConnection.query(getTablesQuery, function (error, results, fields) {
      console.log({results});
      if (error) throw error;
      if(results) {
        mainWindow.webContents.send('DB_LIST_TABLES_QUERY_RESULT', {
          queryName: 'getTablesQuery',
          query: getTablesQuery, 
          error: error, 
          results: results
        });
      }
    });
  }
});

ipcMain.on('GET_TABLE_COLUMNS_QUERY', (event, data) => {
  if(dbConnection) {
    const query = `SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME="${data.tableName}"`;
    dbConnection.query(query, (error, results, fields)=>{
      console.log({results});
      if (error) throw error;
      if(results) {
        mainWindow.webContents.send('DB_TABLE_COLUMNS_QUERY_RESULT', {
          queryName: 'getTableColumnsQuery',
          query: query, 
          error: error, 
          results: results
        });
      }
    });
  }
})
