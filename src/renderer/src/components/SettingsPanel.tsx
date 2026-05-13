import { useState } from 'react'
import { useAppStore } from '../store/useAppStore'
import { X, Moon, Sun, LayoutGrid, List, FolderUp, Link, Bell, Rocket } from 'lucide-react'

interface SettingsPanelProps {
  isOpen: boolean
  onClose: () => void
}

const BG_PRESETS = [
  { label: 'Cosmic', value: '#0f0f23' },
  { label: 'Midnight', value: '#0a0a1a' },
  { label: 'Ocean', value: '#0c1222' },
  { label: 'Forest', value: '#0a1a0f' },
  { label: 'Wine', value: '#1a0a14' },
  { label: 'Slate', value: '#1e293b' }
]

const LIGHT_BG_PRESETS = [
  { label: 'Snow', value: '#f8fafc' },
  { label: 'Cream', value: '#fefce8' },
  { label: 'Lavender', value: '#f5f3ff' },
  { label: 'Mint', value: '#ecfdf5' },
  { label: 'Rose', value: '#fff1f2' },
  { label: 'Sky', value: '#f0f9ff' }
]

export function SettingsPanel({ isOpen, onClose }: SettingsPanelProps) {
  const settings = useAppStore((s) => s.settings)
  const updateSettings = useAppStore((s) => s.updateSettings)
  const [bgImageUrl, setBgImageUrl] = useState('')

  if (!isOpen) return null

  const bgPresets = settings.theme === 'light' ? LIGHT_BG_PRESETS : BG_PRESETS
  const isUsingImage = settings.backgroundType === 'image'

  const handleImageUrl = (): void => {
    const url = bgImageUrl.trim()
    if (!url) return
    updateSettings({ backgroundType: 'image', backgroundValue: url })
    setBgImageUrl('')
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      const dataUrl = reader.result as string
      updateSettings({ backgroundType: 'image', backgroundValue: dataUrl })
    }
    reader.readAsDataURL(file)
  }

  const handleRemoveImage = (): void => {
    const defaultBg = settings.theme === 'light' ? '#f8fafc' : '#0f0f23'
    updateSettings({ backgroundType: 'color', backgroundValue: defaultBg })
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-6 animate-fade-in"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div
        className="relative bg-surface-1 border border-border rounded-2xl p-7 w-full max-w-md shadow-2xl animate-scale-in max-h-[85vh] overflow-y-auto mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-text-primary">Cài đặt</h3>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center cursor-pointer bg-transparent border-none text-text-muted hover:text-text-primary hover:bg-glass-hover transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-7">
          {/* Theme */}
          <div>
            <label className="text-xs font-medium text-text-secondary mb-2.5 block">Giao diện</label>
            <div className="flex gap-2">
              {(['dark', 'light'] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => updateSettings({ theme: t })}
                  className={`flex-1 py-2.5 rounded-xl text-sm font-medium cursor-pointer border transition-all inline-flex items-center justify-center gap-1.5
                    ${settings.theme === t ? 'bg-accent text-white border-accent' : 'bg-surface-2 text-text-secondary border-border hover:border-border-hover'}`}
                >
                  {t === 'dark' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
                  {t === 'dark' ? 'Tối' : 'Sáng'}
                </button>
              ))}
            </div>
          </div>

          {/* View Mode */}
          <div>
            <label className="text-xs font-medium text-text-secondary mb-2.5 block">Chế độ xem</label>
            <div className="flex gap-2">
              {(['grid', 'list'] as const).map((v) => (
                <button
                  key={v}
                  type="button"
                  onClick={() => updateSettings({ viewMode: v })}
                  className={`flex-1 py-2.5 rounded-xl text-sm font-medium cursor-pointer border transition-all inline-flex items-center justify-center gap-1.5
                    ${settings.viewMode === v ? 'bg-accent text-white border-accent' : 'bg-surface-2 text-text-secondary border-border hover:border-border-hover'}`}
                >
                  {v === 'grid' ? <LayoutGrid className="w-4 h-4" /> : <List className="w-4 h-4" />}
                  {v === 'grid' ? 'Lưới' : 'Danh sách'}
                </button>
              ))}
            </div>
          </div>

          {/* Background Color */}
          <div>
            <label className="text-xs font-medium text-text-secondary mb-2.5 block">Màu nền</label>
            <div className="flex flex-wrap gap-2">
              {bgPresets.map((bg) => (
                <button
                  key={bg.value}
                  type="button"
                  onClick={() => updateSettings({ backgroundType: 'color', backgroundValue: bg.value })}
                  className={`w-12 h-12 rounded-xl cursor-pointer border-2 transition-all hover:scale-105
                    ${!isUsingImage && settings.backgroundValue === bg.value ? 'border-accent ring-2 ring-accent/30' : 'border-border'}`}
                  style={{ backgroundColor: bg.value }}
                  title={bg.label}
                />
              ))}
            </div>
            <div className="mt-3 flex items-center gap-3">
              <label className="text-xs text-text-muted">Tùy chỉnh:</label>
              <input
                type="color"
                value={isUsingImage ? '#0f0f23' : settings.backgroundValue}
                onChange={(e) =>
                  updateSettings({ backgroundType: 'color', backgroundValue: e.target.value })
                }
                className="w-8 h-8 rounded-lg cursor-pointer border-none"
              />
              <span className="text-xs text-text-muted font-mono uppercase">
                {isUsingImage ? '—' : settings.backgroundValue}
              </span>
            </div>
          </div>

          {/* Background Image */}
          <div>
            <label className="text-xs font-medium text-text-secondary mb-2.5 block">Ảnh nền</label>

            {/* Current image preview */}
            {isUsingImage && (
              <div className="mb-3 relative rounded-xl overflow-hidden border border-border group">
                <img
                  src={settings.backgroundValue}
                  alt="Background preview"
                  className="w-full h-24 object-cover"
                  onError={(e) => {
                    ;(e.target as HTMLImageElement).style.display = 'none'
                  }}
                />
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/60 text-white flex items-center justify-center cursor-pointer border-none hover:bg-red-600 transition-colors opacity-0 group-hover:opacity-100"
                  title="Xóa ảnh nền"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Upload from computer */}
            <label className="flex items-center gap-3 px-4 py-3 rounded-xl bg-surface-2 border border-border cursor-pointer hover:border-border-hover transition-all">
              <FolderUp className="w-5 h-5 text-accent" />
              <span className="text-sm text-text-secondary">Tải ảnh lên từ máy tính...</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>

            {/* URL input */}
            <div className="mt-3 flex items-center gap-2">
              <div className="relative flex-1">
                <Link className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                <input
                  className="input-field pl-9"
                  value={bgImageUrl}
                  onChange={(e) => setBgImageUrl(e.target.value)}
                  placeholder="Hoặc dán URL ảnh..."
                  onKeyDown={(e) => e.key === 'Enter' && handleImageUrl()}
                />
              </div>
              <button
                type="button"
                onClick={handleImageUrl}
                className="btn-primary shrink-0 px-4 py-2.5 text-sm"
                disabled={!bgImageUrl.trim()}
              >
                Áp dụng
              </button>
            </div>
          </div>

          {/* Health Check Interval */}
          <div>
            <label className="text-xs font-medium text-text-secondary mb-2.5 block">
              Tần suất kiểm tra sức khỏe
            </label>
            <div className="flex items-center gap-3">
              <input
                type="number"
                min={1}
                max={60}
                value={settings.healthCheckInterval}
                onChange={(e) => {
                  const val = parseInt(e.target.value) || 5
                  updateSettings({ healthCheckInterval: Math.max(1, Math.min(60, val)) })
                }}
                className="input-field w-24 text-center"
              />
              <span className="text-sm text-text-muted">phút</span>
            </div>
            <p className="text-xs text-text-muted mt-2">
              Khoảng thời gian ping các dịch vụ đã bật kiểm tra sức khỏe (1–60 phút)
            </p>
          </div>

          {/* Open at Login Toggle */}
          <div>
            <label className="text-xs font-medium text-text-secondary mb-2.5 block">
              Khởi động cùng máy tính
            </label>
            <div className="flex items-center gap-3">
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={settings.openAtLogin || false}
                  onChange={(e) => updateSettings({ openAtLogin: e.target.checked })}
                />
                <div className="w-11 h-6 bg-surface-2 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent border border-border"></div>
              </label>
              <div className="flex items-center gap-1.5 text-sm text-text-primary">
                <Rocket className="w-4 h-4 text-accent" />
                <span>{settings.openAtLogin ? 'Đang bật' : 'Đang tắt'}</span>
              </div>
            </div>
            <p className="text-xs text-text-muted mt-2">
              Tự động mở WanBi Hub Launcher ngầm khi bạn bật máy
            </p>
          </div>

          {/* Notifications Toggle */}
          <div>
            <label className="text-xs font-medium text-text-secondary mb-2.5 block">
              Thông báo
            </label>
            <div className="flex items-center gap-3">
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={settings.enableNotifications !== false}
                  onChange={(e) => updateSettings({ enableNotifications: e.target.checked })}
                />
                <div className="w-11 h-6 bg-surface-2 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent border border-border"></div>
              </label>
              <div className="flex items-center gap-1.5 text-sm text-text-primary">
                <Bell className="w-4 h-4 text-accent" />
                <span>{settings.enableNotifications !== false ? 'Đang bật' : 'Đang tắt'}</span>
              </div>
              <button
                type="button"
                onClick={() => {
                  if ('Notification' in window) {
                    if (Notification.permission === 'granted') {
                      new window.Notification('WanBi Hub Launcher', {
                        body: 'Đây là thông báo thử nghiệm! Bạn đã cấp quyền thành công 🎉'
                      })
                    } else {
                      Notification.requestPermission().then(permission => {
                        if (permission === 'granted') {
                          new window.Notification('WanBi Hub Launcher', {
                            body: 'Đây là thông báo thử nghiệm! Bạn đã cấp quyền thành công 🎉'
                          })
                        } else {
                          alert('macOS đang chặn thông báo! Bạn vui lòng vào System Settings > Notifications > Bật cho ứng dụng này nhé.')
                        }
                      })
                    }
                  } else {
                    alert('Hệ thống không hỗ trợ thông báo.')
                  }
                }}
                className="ml-auto text-xs px-3 py-1.5 rounded-lg bg-surface-2 text-text-secondary border border-border hover:border-accent hover:text-accent transition-colors"
                title="Gửi một thông báo thử nghiệm"
              >
                Gửi thử
              </button>
            </div>
            <p className="text-xs text-text-muted mt-2">
              Nhận thông báo khi dịch vụ bị lỗi hoặc kết nối lại thành công
            </p>
          </div>
        </div>

        <div className="flex justify-end mt-7">
          <button type="button" className="btn-primary px-6" onClick={onClose}>
            Xong
          </button>
        </div>
      </div>
    </div>
  )
}
