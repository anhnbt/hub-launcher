import { app, shell, BrowserWindow, ipcMain } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import { registerIpcHandlers } from './ipc-handlers'
import { createTray } from './tray'
import { startPingService, restartPingService, stopPingService } from './ping-service'
import { IPC_CHANNELS } from '../shared/types'

let mainWindow: BrowserWindow | null = null
let isQuitting = false

function createWindow(): void {
  mainWindow = new BrowserWindow({
    width: 1100,
    height: 750,
    minWidth: 800,
    minHeight: 600,
    show: false,
    autoHideMenuBar: true,
    titleBarStyle: 'hiddenInset',
    trafficLightPosition: { x: 16, y: 18 },
    backgroundColor: '#0f0f23',
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  console.log('Preload path:', join(__dirname, '../preload/index.js'))

  mainWindow.on('ready-to-show', () => {
    mainWindow!.show()
    if (is.dev) {
      mainWindow!.webContents.openDevTools()
    }
  })

  // Minimize to tray instead of closing
  mainWindow.on('close', (event) => {
    if (!isQuitting) {
      event.preventDefault()
      mainWindow!.hide()
    }
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

app.commandLine.appendSwitch('remote-debugging-port', '9222')

app.whenReady().then(() => {
  app.setName('WanBi Hub Launcher')
  electronApp.setAppUserModelId('com.hub-launcher')

  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  // Register IPC handlers
  registerIpcHandlers()

  // Handle health check restart when settings change
  ipcMain.handle(IPC_CHANNELS.TRIGGER_HEALTH_CHECK, () => {
    restartPingService()
  })

  createWindow()

  // Create system tray
  if (mainWindow) {
    createTray(mainWindow)
  }

  // Start background health checking
  startPingService()

  app.on('activate', () => {
    if (mainWindow) {
      mainWindow.show()
      mainWindow.focus()
    } else {
      createWindow()
    }
  })
})

// Handle the before-quit event to allow actual quitting
app.on('before-quit', () => {
  isQuitting = true
  stopPingService()
})

// Keep app running in background on all platforms
app.on('window-all-closed', () => {
  // Do nothing - keep the app running in tray
})
