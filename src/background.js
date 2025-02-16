'use strict'

import { app, protocol, BrowserWindow, shell, ipcMain, dialog } from 'electron'
import { autoUpdater } from 'electron-updater'
import log from 'electron-log'
import {
  createProtocol,
  installVueDevtools
} from 'vue-cli-plugin-electron-builder/lib'
import path from 'path'
import { promises as fs } from 'fs'

const isDevelopment = process.env.NODE_ENV !== 'production'

autoUpdater.autoDownload = false
autoUpdater.logger = log
autoUpdater.logger.transports.file.level = 'info'
log.info('App starting...')

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win

function sendStatusToWindow (text) {
  log.info(text)
  win.webContents.send('message', text)
}

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([{ scheme: 'app', privileges: { secure: true, standard: true } }])

function createWindow () {
  // Create the browser window.
  win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true, // Enable context isolation for security
      enableRemoteModule: false, // Disable remote module for security
      preload: path.join(__dirname, 'preload.js')
    }
  })
  
  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    win.loadURL(process.env.WEBPACK_DEV_SERVER_URL)
    if (!process.env.IS_TEST) win.webContents.openDevTools()
  } else {
    createProtocol('app')
    // Load the index.html when not in development
    win.loadURL('app://./index.html')
    autoUpdater.checkForUpdates()
  }
  
  // Open links in the default browser window
  win.webContents.on('new-window', (event, url) => {
    event.preventDefault()
    shell.openExternal(url)
  })
  
  win.on('closed', () => {
    win = null
  })
}

autoUpdater.on('checking-for-update', () => {
  log.info('Checking for update...')
})

autoUpdater.on('update-not-available', (info) => {
  log.info('Update not available.')
  log.info(info)
})

autoUpdater.on('update-available', (info) => {
  log.info(info)
  const result = dialog.showMessageBoxSync({
    type: 'question',
    buttons: ['Download', 'Later'],
    defaultId: 0,
    cancelId: 1,
    title: 'Update Available',
    message: 'Update for DevTrack is available. Would you like to download it now?',
    detail: 'Version ' + info.version
  })
  if (result === 0) {
    log.info('autoUpdater.downloadUpdate...')
    autoUpdater.downloadUpdate()
  }
})

autoUpdater.on('error', (err) => {
  sendStatusToWindow('Error in auto-updater. ' + err)
})

autoUpdater.on('download-progress', (progressObj) => {
  let logMessage = 'Download speed: ' + progressObj.bytesPerSecond
  logMessage = logMessage + ' - Downloaded ' + progressObj.percent + '%'
  logMessage = logMessage + ' (' + progressObj.transferred + '/' + progressObj.total + ')'
  log.info(logMessage)
})

autoUpdater.on('update-downloaded', (info) => {
  log.info(info)
  const result = dialog.showMessageBoxSync({
    type: 'question',
    buttons: ['Install & Restart', 'Later'],
    defaultId: 0,
    cancelId: 1,
    title: 'Update Ready',
    message: 'The update has been downloaded. Do you want to install it now?'
  })
  
  if (result === 0) {
    log.info('autoUpdater.quitAndInstall...')
    autoUpdater.quitAndInstall()
  }
})

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (win === null) {
    createWindow()
  }
})

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', async () => {
  if (isDevelopment && !process.env.IS_TEST) {
    // Install Vue Devtools
    try {
      await installVueDevtools()
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error('Vue Devtools failed to install:', e.toString())
    }
  }
  ipcMain.handle('saveStateDialog', handleSaveStateDialog)
  ipcMain.handle('loadStateDialog', handleLoadStateDialog)
  createWindow()
})

async function handleSaveStateDialog (_event, state) {
  const { canceled, filePath } = await dialog.showSaveDialog({
    title: 'Save Data',
    defaultPath: path.join(app.getPath('desktop'), '/DevTrack.json')
  })
  if (!canceled) {
    fs.writeFile(filePath, JSON.stringify(state, null, 2), err => {
      if (err) {
        alert(err)
      }
    })
    return filePath
  }
}

async function handleLoadStateDialog () {
  const { canceled, filePaths } = await dialog.showOpenDialog({
    title: 'Load Data',
    defaultPath: path.join(app.getPath('desktop'), '/DevTrack.json'),
    properties: ['openFile'],
    filters: [
      { name: 'JSON', extensions: ['json'] }
    ]
  })

  if (!canceled) {
    try {
      const data = await fs.readFile(filePaths[0], { encoding: 'utf8' })
      const jsonObject = JSON.parse(data)
      return {
        filePath: filePaths[0],
        jsonObject
      }
    } catch (err) {
      if (err instanceof SyntaxError) {
        sendStatusToWindow(`The file you selected, ${filePaths[0]}, does not appear to be a JSON file!`)
      } else {
        sendStatusToWindow(`Error while reading file: ${err}`)
      }
    }
  }
}

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
  if (process.platform === 'win32') {
    process.on('message', data => {
      if (data === 'graceful-exit') {
        app.quit()
      }
    })
  } else {
    process.on('SIGTERM', () => {
      app.quit()
    })
  }
}
