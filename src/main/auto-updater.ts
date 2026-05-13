import { autoUpdater } from 'electron-updater'
import { BrowserWindow, ipcMain } from 'electron'
import { IPC_CHANNELS } from '../shared/types'
import { is } from '@electron-toolkit/utils'

export function setupAutoUpdater(mainWindow: BrowserWindow): void {
  // Configure logging
  autoUpdater.logger = console

  // Disable auto download, let user decide when to download
  autoUpdater.autoDownload = false

  // Skip update checks in dev mode to avoid errors (or we can let it fail gracefully)
  if (is.dev) {
    autoUpdater.autoInstallOnAppQuit = false
  }

  // Send status to renderer
  const sendStatus = (status: string, data?: any): void => {
    if (mainWindow && !mainWindow.isDestroyed()) {
      mainWindow.webContents.send(IPC_CHANNELS.UPDATE_STATUS, { status, data })
    }
  }

  // Handle updater events
  autoUpdater.on('checking-for-update', () => {
    sendStatus('checking')
  })

  autoUpdater.on('update-available', (info) => {
    sendStatus('available', info)
  })

  autoUpdater.on('update-not-available', (info) => {
    sendStatus('not-available', info)
  })

  autoUpdater.on('error', (err) => {
    sendStatus('error', err.message || err)
  })

  autoUpdater.on('download-progress', (progressObj) => {
    sendStatus('downloading', progressObj)
  })

  autoUpdater.on('update-downloaded', (info) => {
    sendStatus('downloaded', info)
  })

  // IPC handlers
  ipcMain.handle(IPC_CHANNELS.CHECK_FOR_UPDATE, async (_event, manual: boolean = false) => {
    if (is.dev) {
      sendStatus('checking', { manual })
      // Simulate delay for checking
      setTimeout(() => {
        sendStatus('not-available', { manual })
      }, 1000)
      return
    }
    
    // For production, we can listen once to the next event to attach the manual flag
    // or just send it with checking immediately.
    sendStatus('checking', { manual })
    return autoUpdater.checkForUpdates()
  })

  ipcMain.handle(IPC_CHANNELS.DOWNLOAD_UPDATE, async () => {
    return autoUpdater.downloadUpdate()
  })

  ipcMain.handle(IPC_CHANNELS.QUIT_AND_INSTALL, () => {
    autoUpdater.quitAndInstall()
  })
}
