import { ipcMain, shell, Notification, app, BrowserWindow } from 'electron'
import { join } from 'path'
import { exec } from 'child_process'
import { IPC_CHANNELS } from '../shared/types'
import type { Group, Service, Settings } from '../shared/types'
import {
  getSettings,
  updateSettings,
  getGroups,
  addGroup,
  updateGroup,
  deleteGroup,
  getServices,
  addService,
  updateService,
  deleteService
} from './database'

export function registerIpcHandlers(): void {
  // ── Settings ──────────────────────────────────────
  ipcMain.handle(IPC_CHANNELS.GET_SETTINGS, () => {
    return getSettings()
  })

  ipcMain.handle(IPC_CHANNELS.UPDATE_SETTINGS, (_, partial: Partial<Settings>) => {
    const newSettings = updateSettings(partial)
    
    // Apply login item settings if changed
    if (partial.openAtLogin !== undefined) {
      app.setLoginItemSettings({
        openAtLogin: partial.openAtLogin,
        openAsHidden: true
      })
    }
    
    return newSettings
  })

  // ── Groups ────────────────────────────────────────
  ipcMain.handle(IPC_CHANNELS.GET_GROUPS, () => {
    return getGroups()
  })

  ipcMain.handle(IPC_CHANNELS.ADD_GROUP, (_, group: Group) => {
    return addGroup(group)
  })

  ipcMain.handle(IPC_CHANNELS.UPDATE_GROUP, (_, id: string, partial: Partial<Group>) => {
    return updateGroup(id, partial)
  })

  ipcMain.handle(IPC_CHANNELS.DELETE_GROUP, (_, id: string) => {
    return deleteGroup(id)
  })

  // ── Services ──────────────────────────────────────
  ipcMain.handle(IPC_CHANNELS.GET_SERVICES, () => {
    return getServices()
  })

  ipcMain.handle(IPC_CHANNELS.ADD_SERVICE, (_, service: Service) => {
    return addService(service)
  })

  ipcMain.handle(IPC_CHANNELS.UPDATE_SERVICE, (_, id: string, partial: Partial<Service>) => {
    return updateService(id, partial)
  })

  ipcMain.handle(IPC_CHANNELS.DELETE_SERVICE, (_, id: string) => {
    return deleteService(id)
  })

  // ── Notifications ─────────────────────────────────
  ipcMain.handle(IPC_CHANNELS.TEST_NOTIFICATION, () => {
    console.log('Test Notification Request Received. Supported:', Notification.isSupported())
    if (Notification.isSupported()) {
      new Notification({
        title: 'WanBi Hub Launcher',
        body: 'Đây là thông báo thử nghiệm! Bạn đã cấp quyền thành công 🎉',
        icon: join(__dirname, '../../resources/icon.png')
      }).show()
    } else {
      console.error('Notifications are not supported on this platform/configuration.')
    }

    // Fallback: Also show success feedback in the app UI banner
    const allWindows = BrowserWindow.getAllWindows()
    if (allWindows.length > 0) {
      allWindows[0].webContents.send(IPC_CHANNELS.UPDATE_STATUS, { status: 'test-success' })
    }
  })

  // ── Launch Service ────────────────────────────────
  ipcMain.handle(IPC_CHANNELS.LAUNCH_SERVICE, (_, service: Service) => {
    if (service.type === 'url') {
      shell.openExternal(service.target)
    } else if (service.type === 'cmd') {
      exec(service.target, (error) => {
        if (error) {
          console.error(`Failed to execute command: ${service.target}`, error)
        }
      })
    }
  })

  // ── App Info ──────────────────────────────────────
  ipcMain.handle(IPC_CHANNELS.GET_APP_VERSION, () => {
    return app.getVersion()
  })
}
