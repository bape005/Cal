const electron = require('electron');
const { app, BrowserWindow, ipcMain, nativeTheme, dialog } = electron;
const path = require('path');

//PDF
const { PdfReader } = require("pdfreader");
const fs = require('fs');
const pdf = require('pdf-parse');
var address = require('address')

console.log(address.ip())
address.mac(function(err, address){
    console.log(address);
})

var pathDirectory="";

function createWindow () {
    const {width, height} = electron.screen.getPrimaryDisplay().workAreaSize
    const mainWindow = new BrowserWindow(
        {
            width: width,
            height: height,
            webPreferences: {
                preload: path.join(__dirname, 'preload.js')
            }
        }
    );

    //mainWindow.loadFile('/src/views/index.html')
    mainWindow.loadFile(path.join(__dirname, 'views','index.html'));

    mainWindow.once('ready-to-show', () => {
        mainWindow.maximize();
        nativeTheme.themeSource = 'dark';
    });

    ipcMain.handle('dark-mode:toggle', () => {
        if (nativeTheme.shouldUseDarkColors) {
        nativeTheme.themeSource = 'light'
        } else {
            nativeTheme.themeSource = 'dark'
        }
        return nativeTheme.shouldUseDarkColors
    });

    ipcMain.handle('dark-mode:system', () => {
        nativeTheme.themeSource = 'system'
    });

    ipcMain.handle('document:getDocuments', async (event, message) => {
        if(pathDirectory!=''){
            return await leerPDF()
                .then((data) => {
                    //console.log('handle: ' + data); // Testing
                    return data;
                })
                .catch((error) => {
                    console.log('handle error: ' + error); // Testing
                    return 'Error Loading Log File';
                });
        }else{
            return 'No hay una ruta';
        }    
    });

    ipcMain.handle('document:openExplorer',  async (event, message) => {
        return await openDirectory(mainWindow)
            .then((data) => {
                //console.log('handle: ' + data); // Testing
                return data;
            })
            .catch((error) => {
                console.log('handle error: ' + error); // Testing
                return 'Error Explorer';
            })
    });
  
}

app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
});

function openDirectory(mainWindow){
    return new Promise((resolve, reject) => {
        dialog.showOpenDialog(mainWindow, {
            properties: ['openFile', 'openDirectory']
          }).then(result => {
            //console.log(result.canceled)
            if(result.canceled==false){
                console.log(result.filePaths)
                //mainWindow.webContents.send('pathDirectory',result.filePaths);
                pathDirectory=result.filePaths;
                resolve(result.filePaths);
            }
          }).catch(err => {
            console.log(err);
            reject(err);
          })
    });
}

function leerPDF(){
    return new Promise((resolve, reject) => {
        var numeroBoleto = -1;
        var a=[];
        var boletos=[];
        var boleto=[];
        var isCambio=-1;
        new PdfReader().parseFileItems(path.join(pathDirectory[0], '/Boleto2.pdf'), (err, item) => {
            if (err) {
                console.error("error:", err);
                reject(err);
            }
            
            else if (!item) {
                console.warn("end of file");

                boletos.shift();
                boletos.push(boleto);

                var boletosFiltrados = [];
                i=1;
                boletos.forEach(function(boleto){
                    bol = {
                        ID : i,
                        Nombre:boleto[10],
                        Compania: boleto[9],
                        LibretaMar: boleto[8],
                        Origen: boleto[18],
                        Solicitud: boleto[15],
                        Vigencia: boleto[7],
                        Servicio: boleto[27],
                        Destino: boleto[21],
                        Itinerario: boleto[29],
                        FechaHoraSalida: boleto[24]
                    }; 
                    boletosFiltrados.push(bol);
                    i++;
                    /*console.log('Nombre: ', boleto[10]);
                    console.log('Compañía: ', boleto[9]);
                    console.log('LIB.MAR: ', boleto[8]);
                    console.log('Origen: ', boleto[18]);
                    console.log('Solicitud: ', boleto[15]);
                    console.log('Vigencia: ', boleto[7]);
                    console.log('Servicio: ', boleto[27]);
                    console.log('Destino: ', boleto[21]);
                    console.log('Itinerario: ', boleto[29]);
                    console.log('Fec/Hora Salida: ', boleto[24]);*/

                });

                resolve(boletosFiltrados);
            }
                
            else if (item.text) {
                if(item.text.trim()=='SERVICIO DE TRANSPORTE DE PERSONAL PEMEX'){ //SI
                    boletos.push(boleto);
                    boleto=[];
                    numeroBoleto++;
                }
                boleto.push(item.text.trim());
            }
        });
    });
    
}


/*const electron = require('electron');
const {app, BrowserWindow, ipcMain} = electron;
const url = require("url");
const path = require("path");

let mainWindow;

app.on('ready', () => {
    const {width, height} = electron.screen.getPrimaryDisplay().workAreaSize
    //win = new BrowserWindow({width, height});

    mainWindow = new BrowserWindow({
        width, 
        height,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            enableRemoteModule: true,
        },
    });

  
    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'views/index.html'),
        protocol: 'file',
        slashes: true
    }));

    mainWindow.once('ready-to-show', () => {
        mainWindow.maximize()
    });
});

ipcMain.on('documento:new', (e, data) => {
    console.log(data);
});*/