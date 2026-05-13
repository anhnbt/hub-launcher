import { app } from 'electron'
import { join } from 'path'
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs'
import type { DatabaseSchema, Settings, Group, Service } from '../shared/types'

const DB_DIR = join(app.getPath('userData'), '.hub-launcher')
const DB_FILE = join(DB_DIR, 'db.json')

const DEFAULT_DATA: DatabaseSchema = {
  settings: {
    theme: 'dark',
    backgroundType: 'color',
    backgroundValue: '#0f0f23',
    viewMode: 'grid',
    healthCheckInterval: 5,
    enableNotifications: true
  },
  groups: [
    { id: 'g-work', name: 'Công việc', order: 0 },
    { id: 'g-learn', name: 'Học tập', order: 1 }
  ],
  services: [
    {
      id: 's-ecms',
      groupId: 'g-work',
      name: 'ECMS Điện lực',
      type: 'url',
      target: 'https://ecms.dienluc.vn',
      iconType: 'emoji',
      iconValue: '⚡',
      enableHealthCheck: true,
      healthEndpoint: '',
      status: 'unknown',
      order: 0
    },
    {
      id: 's-eagent',
      groupId: 'g-work',
      name: 'eAgent',
      type: 'url',
      target: 'https://eagent.vn',
      iconType: 'emoji',
      iconValue: '🏦',
      enableHealthCheck: true,
      healthEndpoint: '',
      status: 'unknown',
      order: 1
    },
    {
      id: 's-quanly',
      groupId: 'g-work',
      name: 'Quản lý Điện lực',
      type: 'url',
      target: 'http://quanly.dienluc.vn',
      iconType: 'emoji',
      iconValue: '📊',
      enableHealthCheck: false,
      status: 'unknown',
      order: 2
    },
    {
      id: 's-slack',
      groupId: 'g-work',
      name: 'Slack',
      type: 'url',
      target: 'slack://',
      iconType: 'emoji',
      iconValue: '💬',
      enableHealthCheck: false,
      status: 'unknown',
      order: 3
    },
    {
      id: 's-attendance',
      groupId: 'g-learn',
      name: 'Điểm danh C0925L1',
      type: 'url',
      target: 'https://andy.codegym.vn/center/1/groups/580/attendances/create',
      iconType: 'emoji',
      iconValue: '📋',
      enableHealthCheck: false,
      status: 'unknown',
      order: 0
    },
    {
      id: 's-meeting',
      groupId: 'g-learn',
      name: 'Meeting dạy học',
      type: 'url',
      target: 'https://meet.google.com/yca-mmds-fdm',
      iconType: 'emoji',
      iconValue: '🎥',
      enableHealthCheck: false,
      status: 'unknown',
      order: 1
    }
  ]
}

function ensureDbDir(): void {
  if (!existsSync(DB_DIR)) {
    mkdirSync(DB_DIR, { recursive: true })
  }
}

function readDb(): DatabaseSchema {
  ensureDbDir()
  if (!existsSync(DB_FILE)) {
    writeFileSync(DB_FILE, JSON.stringify(DEFAULT_DATA, null, 2), 'utf-8')
    return structuredClone(DEFAULT_DATA)
  }
  try {
    const raw = readFileSync(DB_FILE, 'utf-8')
    return JSON.parse(raw) as DatabaseSchema
  } catch {
    writeFileSync(DB_FILE, JSON.stringify(DEFAULT_DATA, null, 2), 'utf-8')
    return structuredClone(DEFAULT_DATA)
  }
}

function writeDb(data: DatabaseSchema): void {
  ensureDbDir()
  writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8')
}

// ── Settings ──────────────────────────────────────────────
export function getSettings(): Settings {
  return readDb().settings
}

export function updateSettings(partial: Partial<Settings>): Settings {
  const db = readDb()
  db.settings = { ...db.settings, ...partial }
  writeDb(db)
  return db.settings
}

// ── Groups ────────────────────────────────────────────────
export function getGroups(): Group[] {
  return readDb().groups.sort((a, b) => a.order - b.order)
}

export function addGroup(group: Group): Group[] {
  const db = readDb()
  db.groups.push(group)
  writeDb(db)
  return db.groups.sort((a, b) => a.order - b.order)
}

export function updateGroup(id: string, partial: Partial<Group>): Group[] {
  const db = readDb()
  const idx = db.groups.findIndex((g) => g.id === id)
  if (idx !== -1) {
    db.groups[idx] = { ...db.groups[idx], ...partial }
    writeDb(db)
  }
  return db.groups.sort((a, b) => a.order - b.order)
}

export function deleteGroup(id: string): Group[] {
  const db = readDb()
  db.groups = db.groups.filter((g) => g.id !== id)
  // Also remove services in this group
  db.services = db.services.filter((s) => s.groupId !== id)
  writeDb(db)
  return db.groups.sort((a, b) => a.order - b.order)
}

// ── Services ──────────────────────────────────────────────
export function getServices(): Service[] {
  return readDb().services.sort((a, b) => a.order - b.order)
}

export function addService(service: Service): Service[] {
  const db = readDb()
  db.services.push(service)
  writeDb(db)
  return db.services.sort((a, b) => a.order - b.order)
}

export function updateService(id: string, partial: Partial<Service>): Service[] {
  const db = readDb()
  const idx = db.services.findIndex((s) => s.id === id)
  if (idx !== -1) {
    db.services[idx] = { ...db.services[idx], ...partial }
    writeDb(db)
  }
  return db.services.sort((a, b) => a.order - b.order)
}

export function deleteService(id: string): Service[] {
  const db = readDb()
  db.services = db.services.filter((s) => s.id !== id)
  writeDb(db)
  return db.services.sort((a, b) => a.order - b.order)
}

// ── Bulk status update (used by ping service) ─────────────
export function updateServiceStatus(id: string, status: Service['status']): void {
  const db = readDb()
  const idx = db.services.findIndex((s) => s.id === id)
  if (idx !== -1) {
    db.services[idx].status = status
    db.services[idx].lastChecked = new Date().toISOString()
    writeDb(db)
  }
}

export function getHealthCheckServices(): Service[] {
  return readDb().services.filter((s) => s.enableHealthCheck)
}
