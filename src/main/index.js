import { app, shell, BrowserWindow, ipcMain } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import fs from "fs";

import icon from '../../resources/icon.png?asset'
import SocketHandler from "./server/socketServer";
import { HttpExpressServer, HttpsExpressServer } from "./server/ExpressServe";
import { mapedarrayobs, arrayobs,functionsWithoutParams,executebykeyasync } from './features/obscontroller.js';
import { injectQRCode, socketemitQRCode, getLocalIPAddress } from './features/GenQR.js';

//import { Socket } from 'net';

const socketHandler = new SocketHandler();
const newsocketHandler = new SocketHandler();
const httpServer = new HttpExpressServer();
const httpsServer = new HttpsExpressServer();
const servers = [httpServer, httpsServer];
const sockets = [socketHandler, newsocketHandler];
let Port;
let io;
async function startServer() {
  const httpPort = 8090;
  const httpsPort = 0;
  const privateKey = process.env.PRIVATE_KEY || import.meta.env.VITE_PRIVATE_KEY;
  const certificate = process.env.CERTIFICATE || import.meta.env.VITE_CERTIFICATE;
  console.log("privateKey", privateKey,"certificate", certificate);
  const credentials = { key: privateKey, cert: certificate };
  await httpServer.initialize(httpPort);
  await httpsServer.initialize(httpsPort, credentials);
  servers.forEach((server, index) => {
    sockets[index].initialize(server.server);

    sockets[index].onEvent("connection", (socket) => handleSocketEvents(socket, index,server.getListenPort()));
  });

  console.log(`HTTP server running on port ${httpServer.getListenPort()}`);
  console.log(`HTTPS server running on port ${httpsServer.getListenPort()}`);
  Port = httpsServer.getListenPort();
  return httpsServer.getListenPort();
}
function handleSocketEvents(socket, index, Port) {
  console.log('handleSocketEvents',index);
  socketemitQRCode(socket, Port);
  mapedarrayobs.forEach((value,key) => {
    //console.log("mapedarrayobs",key,value,value.value);
    socket.on(value.value, async (...args) => {
      console.log("socketemitkey",key,value.value,...args);
      const valueobsaction = arrayobs[value.value];
      if (args.length > 0) {
        const response = await valueobsaction.function(...args);
        socket.emit("responseobs",response,valueobsaction.name);
        console.log("response", response);
      } else {
        // Si no hay parámetros, se ejecuta otra acción o consulta
        const response = await executebykeyasync(valueobsaction.name);
        socket.emit("responseobs",response,valueobsaction.name);
        console.log("response", response);
      }
      console.log("valueobsaction getValueByKey", valueobsaction);
      //socketManager.emitMessage(key,...args);
    });
  });
  socket.on("connectobs", async (ip,port,auth) => {
    console.log("connectobs",ip,port,auth);
    const response = await arrayobs.connect.function(ip,port,auth);
    socket.emit("responseobs",response,"connectobs");
    console.log("response", response);
  });
  socket.on("changeInputVolume", async (data) => {
    console.log("changeInputVolume",data);
    const response = await arrayobs.setInputVolume.function(data.inputName,data.db);
    socket.emit("responseobs",response,"changeInputVolume");
    console.log("response", response);
  });
  socket.on("disconnect", () => {
    console.log("disconnect");
  });
}
function createWindow() {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
startServer()
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  // IPC test
  ipcMain.on('ping', () => console.log('pong'))

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
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.
