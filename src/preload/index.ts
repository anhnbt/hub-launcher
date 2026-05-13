import { contextBridge, ipcRenderer } from 'electron'
import { IPC_CHANNELS } from '../shared/types'
import type { Settings, Group, Service } from '../shared/types'

console.log(">>> PRELOAD SCRIPT EXECUTING <<<")

const api = {
  // Settings
  getSettings: (): Promise<Settings> => ipcRenderer.invoke(IPC_CHANNELS.GET_SETTINGS),
  updateSettings: (partial: Partial<Settings>): Promise<Settings> =>
    ipcRenderer.invoke(IPC_CHANNELS.UPDATE_SETTINGS, partial),

  // Groups
  getGroups: (): Promise<Group[]> => ipcRenderer.invoke(IPC_CHANNELS.GET_GROUPS),
  addGroup: (group: Group): Promise<Group[]> => ipcRenderer.invoke(IPC_CHANNELS.ADD_GROUP, group),
  updateGroup: (id: string, partial: Partial<Group>): Promise<Group[]> =>
    ipcRenderer.invoke(IPC_CHANNELS.UPDATE_GROUP, id, partial),
  deleteGroup: (id: string): Promise<Group[]> => ipcRenderer.invoke(IPC_CHANNELS.DELETE_GROUP, id),

  // Services
  getServices: (): Promise<Service[]> => ipcRenderer.invoke(IPC_CHANNELS.GET_SERVICES),
  addService: (service: Service): Promise<Service[]> =>
    ipcRenderer.invoke(IPC_CHANNELS.ADD_SERVICE, service),
  updateService: (id: string, partial: Partial<Service>): Promise<Service[]> =>
    ipcRenderer.invoke(IPC_CHANNELS.UPDATE_SERVICE, id, partial),
  deleteService: (id: string): Promise<Service[]> =>
    ipcRenderer.invoke(IPC_CHANNELS.DELETE_SERVICE, id),

  // Actions
  launchService: (service: Service): Promise<void> =>
    ipcRenderer.invoke(IPC_CHANNELS.LAUNCH_SERVICE, service),
  triggerHealthCheck: (): Promise<void> =>
    ipcRenderer.invoke(IPC_CHANNELS.TRIGGER_HEALTH_CHECK),

  // Listen for health status updates from main process
  onHealthStatusUpdate: (
    callback: (data: { serviceId: string; status: string; lastChecked: string }) => void
  ): (() => void) => {
    const handler = (_: Electron.IpcRendererEvent, data: { serviceId: string; status: string; lastChecked: string }): void => {
      callback(data)
    }
    ipcRenderer.on(IPC_CHANNELS.HEALTH_STATUS_UPDATE, handler)
    return () => {
      ipcRenderer.removeListener(IPC_CHANNELS.HEALTH_STATUS_UPDATE, handler)
    }
  }
}

export type ApiType = typeof api

if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore
  window.api = api
}
