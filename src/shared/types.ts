// Shared types between main and renderer processes

export interface Settings {
  theme: 'dark' | 'light' | 'system'
  backgroundType: 'color' | 'image'
  backgroundValue: string
  viewMode: 'grid' | 'list'
  healthCheckInterval: number // minutes
  enableNotifications?: boolean
  openAtLogin?: boolean
}

export interface Group {
  id: string
  name: string
  order: number
}

export interface Service {
  id: string
  groupId: string
  name: string
  type: 'url' | 'cmd'
  target: string
  iconType: 'emoji' | 'image'
  iconValue: string
  enableHealthCheck: boolean
  healthEndpoint?: string
  status: 'online' | 'offline' | 'unknown'
  lastChecked?: string
  order: number
}

export interface DatabaseSchema {
  settings: Settings
  groups: Group[]
  services: Service[]
}

// IPC Channel names
export const IPC_CHANNELS = {
  // Settings
  GET_SETTINGS: 'db:get-settings',
  UPDATE_SETTINGS: 'db:update-settings',

  // Groups
  GET_GROUPS: 'db:get-groups',
  ADD_GROUP: 'db:add-group',
  UPDATE_GROUP: 'db:update-group',
  DELETE_GROUP: 'db:delete-group',

  // Services
  GET_SERVICES: 'db:get-services',
  ADD_SERVICE: 'db:add-service',
  UPDATE_SERVICE: 'db:update-service',
  DELETE_SERVICE: 'db:delete-service',

  // Actions
  LAUNCH_SERVICE: 'action:launch-service',
  GET_HEALTH_STATUS: 'action:get-health-status',
  TRIGGER_HEALTH_CHECK: 'action:trigger-health-check',

  // Health status updates (main -> renderer)
  HEALTH_STATUS_UPDATE: 'health:status-update',

  // Notifications
  TEST_NOTIFICATION: 'action:test-notification'
} as const
