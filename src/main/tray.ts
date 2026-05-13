import { Tray, Menu, nativeImage, BrowserWindow, app } from 'electron'
import { join } from 'path'

let tray: Tray | null = null

export function createTray(mainWindow: BrowserWindow): Tray {
  // Use a small icon for tray
  const iconPath = join(__dirname, '../../resources/icon.png')
  const trayIcon = nativeImage.createFromPath(iconPath).resize({ width: 18, height: 18 })

  tray = new Tray(trayIcon)
  tray.setToolTip('Hub Launcher')

  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Show Dashboard',
      click: (): void => {
        mainWindow.show()
        mainWindow.focus()
      }
    },
    { type: 'separator' },
    {
      label: 'Quit',
      click: (): void => {
        app.quit()
      }
    }
  ])

  tray.setContextMenu(contextMenu)

  tray.on('click', () => {
    if (mainWindow.isVisible()) {
      mainWindow.focus()
    } else {
      mainWindow.show()
      mainWindow.focus()
    }
  })

  return tray
}

export function destroyTray(): void {
  if (tray) {
    tray.destroy()
    tray = null
  }
}
