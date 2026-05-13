import { Notification, BrowserWindow } from 'electron'
import { net } from 'electron'
import { getHealthCheckServices, updateServiceStatus, getSettings } from './database'
import { IPC_CHANNELS } from '../shared/types'

let intervalId: ReturnType<typeof setInterval> | null = null

async function checkServiceHealth(url: string): Promise<boolean> {
  return new Promise((resolve) => {
    try {
      const request = net.request(url)

      const timeout = setTimeout(() => {
        request.abort()
        resolve(false)
      }, 10000) // 10s timeout

      request.on('response', (response) => {
        clearTimeout(timeout)
        resolve(response.statusCode >= 200 && response.statusCode < 400)
      })

      request.on('error', () => {
        clearTimeout(timeout)
        resolve(false)
      })

      request.end()
    } catch {
      resolve(false)
    }
  })
}

async function runHealthChecks(): Promise<void> {
  const services = getHealthCheckServices()
  const settings = getSettings()

  for (const service of services) {
    const endpoint = service.healthEndpoint || service.target
    const isHealthy = await checkServiceHealth(endpoint)
    const newStatus = isHealthy ? 'online' : 'offline'
    const previousStatus = service.status

    updateServiceStatus(service.id, newStatus as 'online' | 'offline')

    // Send status update to renderer
    const windows = BrowserWindow.getAllWindows()
    for (const win of windows) {
      win.webContents.send(IPC_CHANNELS.HEALTH_STATUS_UPDATE, {
        serviceId: service.id,
        status: newStatus,
        lastChecked: new Date().toISOString()
      })
    }

    if (settings.enableNotifications !== false) {
      // Show notification only when status changes to offline
      if (newStatus === 'offline' && previousStatus !== 'offline') {
        new Notification({
          title: '🥺 Ôi hỏng! Mất kết nối rồi',
          body: `Hiện không thể kết nối tới ${service.name}. Bạn kiểm tra lại xem dịch vụ có đang chạy tại:\n${endpoint} không nhé!`,
          urgency: 'critical'
        }).show()
      }

      // Show recovery notification
      if (newStatus === 'online' && previousStatus === 'offline') {
        new Notification({
          title: '🎉 Tuyệt vời! Dịch vụ đã sống lại',
          body: `Tin vui đây! ${service.name} đã kết nối lại thành công và đang hoạt động bình thường.`,
          urgency: 'normal'
        }).show()
      }
    }
  }
}

export function startPingService(): void {
  // Run immediately on start
  runHealthChecks()

  // Then run on interval
  const settings = getSettings()
  const intervalMs = (settings.healthCheckInterval || 5) * 60 * 1000

  intervalId = setInterval(() => {
    runHealthChecks()
  }, intervalMs)
}

export function restartPingService(): void {
  if (intervalId) {
    clearInterval(intervalId)
  }
  startPingService()
}

export function stopPingService(): void {
  if (intervalId) {
    clearInterval(intervalId)
    intervalId = null
  }
}
