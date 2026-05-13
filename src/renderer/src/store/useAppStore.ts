import { create } from 'zustand'
import type { Settings, Group, Service } from '../../../shared/types'

interface AppState {
  settings: Settings
  groups: Group[]
  services: Service[]
  isLoading: boolean

  // Actions
  loadAll: () => Promise<void>
  updateSettings: (partial: Partial<Settings>) => Promise<void>

  addGroup: (name: string) => Promise<void>
  updateGroup: (id: string, partial: Partial<Group>) => Promise<void>
  deleteGroup: (id: string) => Promise<void>

  addService: (service: Service) => Promise<void>
  updateService: (id: string, partial: Partial<Service>) => Promise<void>
  deleteService: (id: string) => Promise<void>

  launchService: (service: Service) => Promise<void>
  updateServiceStatus: (serviceId: string, status: string, lastChecked: string) => void
}

export const useAppStore = create<AppState>((set, get) => ({
  settings: {
    theme: 'dark',
    backgroundType: 'color',
    backgroundValue: '#0f0f23',
    viewMode: 'grid',
    healthCheckInterval: 5
  },
  groups: [],
  services: [],
  isLoading: true,

  loadAll: async () => {
    if (!window?.api) {
      set({ isLoading: false })
      return
    }
    const [settings, groups, services] = await Promise.all([
      window.api.getSettings(),
      window.api.getGroups(),
      window.api.getServices()
    ])
    set({ settings, groups, services, isLoading: false })
  },

  updateSettings: async (partial) => {
    if (!window?.api) return
    const settings = await window.api.updateSettings(partial)
    set({ settings })
    // If health check interval changed, restart the ping service
    if (partial.healthCheckInterval !== undefined) {
      await window.api.triggerHealthCheck()
    }
  },

  addGroup: async (name) => {
    if (!window?.api) return
    const id = `g-${Date.now()}`
    const order = get().groups.length
    const groups = await window.api.addGroup({ id, name, order })
    set({ groups })
  },

  updateGroup: async (id, partial) => {
    if (!window?.api) return
    const groups = await window.api.updateGroup(id, partial)
    set({ groups })
  },

  deleteGroup: async (id) => {
    if (!window?.api) return
    const groups = await window.api.deleteGroup(id)
    // Reload services since some may have been deleted
    const services = await window.api.getServices()
    set({ groups, services })
  },

  addService: async (service) => {
    if (!window?.api) return
    const services = await window.api.addService(service)
    set({ services })
  },

  updateService: async (id, partial) => {
    if (!window?.api) return
    const services = await window.api.updateService(id, partial)
    set({ services })
  },

  deleteService: async (id) => {
    if (!window?.api) return
    const services = await window.api.deleteService(id)
    set({ services })
  },

  launchService: async (service) => {
    if (!window?.api) return
    await window.api.launchService(service)
  },

  updateServiceStatus: (serviceId, status, lastChecked) => {
    set((state) => ({
      services: state.services.map((s) =>
        s.id === serviceId ? { ...s, status: status as Service['status'], lastChecked } : s
      )
    }))
  }
}))
