import { useState, useEffect } from 'react'
import { useAppStore } from '../store/useAppStore'
import { X, Globe, Terminal as TerminalIcon } from 'lucide-react'
import type { Service } from '../../../shared/types'

const EMOJI_SUGGESTIONS = ['⚡', '🌐', '🏦', '💬', '📊', '📋', '🎥', '🚀', '🔧', '📧', '🎯', '🛠️', '📱', '💻', '🗂️', '📝', '🔒', '☁️', '🎨', '📦']

interface ServiceModalProps {
  isOpen: boolean
  onClose: () => void
  editService?: Service | null
  defaultGroupId?: string
}

export function ServiceModal({
  isOpen,
  onClose,
  editService,
  defaultGroupId
}: ServiceModalProps) {
  const groups = useAppStore((s) => s.groups)
  const services = useAppStore((s) => s.services)
  const addService = useAppStore((s) => s.addService)
  const updateService = useAppStore((s) => s.updateService)
  const deleteService = useAppStore((s) => s.deleteService)

  const [name, setName] = useState('')
  const [type, setType] = useState<'url' | 'cmd'>('url')
  const [target, setTarget] = useState('')
  const [groupId, setGroupId] = useState('')
  const [iconValue, setIconValue] = useState('🌐')
  const [enableHealthCheck, setEnableHealthCheck] = useState(false)
  const [healthEndpoint, setHealthEndpoint] = useState('')

  useEffect(() => {
    if (editService) {
      setName(editService.name)
      setType(editService.type)
      setTarget(editService.target)
      setGroupId(editService.groupId)
      setIconValue(editService.iconValue)
      setEnableHealthCheck(editService.enableHealthCheck)
      setHealthEndpoint(editService.healthEndpoint || '')
    } else {
      setName('')
      setType('url')
      setTarget('')
      setGroupId(defaultGroupId || groups[0]?.id || '')
      setIconValue('🌐')
      setEnableHealthCheck(false)
      setHealthEndpoint('')
    }
  }, [editService, defaultGroupId, groups, isOpen])

  if (!isOpen) return null

  const handleSave = async (): Promise<void> => {
    if (!name.trim() || !target.trim()) return

    if (editService) {
      await updateService(editService.id, {
        name: name.trim(),
        type,
        target: target.trim(),
        groupId,
        iconType: 'emoji',
        iconValue,
        enableHealthCheck,
        healthEndpoint: healthEndpoint.trim() || undefined
      })
    } else {
      const order = services.filter((s) => s.groupId === groupId).length
      await addService({
        id: `s-${Date.now()}`,
        name: name.trim(),
        type,
        target: target.trim(),
        groupId,
        iconType: 'emoji',
        iconValue,
        enableHealthCheck,
        healthEndpoint: healthEndpoint.trim() || undefined,
        status: 'unknown',
        order
      })
    }
    onClose()
  }

  const handleDelete = async (): Promise<void> => {
    if (editService) {
      await deleteService(editService.id)
      onClose()
    }
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
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-lg font-semibold text-text-primary">
            {editService ? 'Chỉnh sửa dịch vụ' : 'Thêm dịch vụ'}
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center cursor-pointer bg-transparent border-none text-text-muted hover:text-text-primary hover:bg-glass-hover transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-5">
          {/* Emoji Picker */}
          <div>
            <label className="text-xs font-medium text-text-secondary mb-2 block">Biểu tượng</label>
            <div className="flex flex-wrap gap-2">
              {EMOJI_SUGGESTIONS.map((emoji) => (
                <button
                  key={emoji}
                  type="button"
                  onClick={() => setIconValue(emoji)}
                  className={`w-9 h-9 rounded-lg flex items-center justify-center text-lg cursor-pointer border transition-all
                    ${iconValue === emoji ? 'bg-accent/20 border-accent scale-110' : 'bg-surface-2 border-border hover:border-border-hover'}`}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>

          {/* Name */}
          <div>
            <label className="text-xs font-medium text-text-secondary mb-2 block">Tên dịch vụ</label>
            <input
              className="input-field"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="VD: eAgent CMS"
            />
          </div>

          {/* Type */}
          <div>
            <label className="text-xs font-medium text-text-secondary mb-2 block">Loại</label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setType('url')}
                className={`flex-1 py-2.5 rounded-xl text-sm font-medium cursor-pointer border transition-all inline-flex items-center justify-center gap-1.5
                  ${type === 'url' ? 'bg-accent text-white border-accent' : 'bg-surface-2 text-text-secondary border-border'}`}
              >
                <Globe className="w-4 h-4" />
                URL / URI
              </button>
              <button
                type="button"
                onClick={() => setType('cmd')}
                className={`flex-1 py-2.5 rounded-xl text-sm font-medium cursor-pointer border transition-all inline-flex items-center justify-center gap-1.5
                  ${type === 'cmd' ? 'bg-accent text-white border-accent' : 'bg-surface-2 text-text-secondary border-border'}`}
              >
                <TerminalIcon className="w-4 h-4" />
                Lệnh hệ thống
              </button>
            </div>
          </div>

          {/* Target */}
          <div>
            <label className="text-xs font-medium text-text-secondary mb-2 block">
              {type === 'url' ? 'Địa chỉ URL / URI Scheme' : 'Lệnh hệ thống'}
            </label>
            <input
              className="input-field"
              value={target}
              onChange={(e) => setTarget(e.target.value)}
              placeholder={
                type === 'url' ? 'https://example.com hoặc slack://' : 'open -a Slack'
              }
            />
          </div>

          {/* Group */}
          <div>
            <label className="text-xs font-medium text-text-secondary mb-2 block">Nhóm</label>
            <select
              className="input-field"
              value={groupId}
              onChange={(e) => setGroupId(e.target.value)}
            >
              {groups.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.name}
                </option>
              ))}
            </select>
          </div>

          {/* Health Check Toggle */}
          <div className="flex items-center justify-between py-2 px-1">
            <div>
              <div className="text-sm text-text-primary">Giám sát sức khỏe</div>
              <div className="text-xs text-text-muted mt-0.5">Theo dõi trạng thái hoạt động của dịch vụ</div>
            </div>
            <button
              type="button"
              onClick={() => setEnableHealthCheck(!enableHealthCheck)}
              className={`w-11 h-6 rounded-full cursor-pointer transition-colors relative border-none
                ${enableHealthCheck ? 'bg-accent' : 'bg-surface-3'}`}
            >
              <div
                className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-transform shadow-sm
                  ${enableHealthCheck ? 'translate-x-5.5' : 'translate-x-0.5'}`}
              />
            </button>
          </div>

          {/* Health Endpoint */}
          {enableHealthCheck && (
            <div>
              <label className="text-xs font-medium text-text-secondary mb-2 block">
                Endpoint kiểm tra (tùy chọn)
              </label>
              <input
                className="input-field"
                value={healthEndpoint}
                onChange={(e) => setHealthEndpoint(e.target.value)}
                placeholder="Để trống sẽ dùng URL chính"
              />
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 mt-7">
          {editService && (
            <button type="button" className="btn-danger" onClick={handleDelete}>
              Xóa
            </button>
          )}
          <div className="flex-1" />
          <button type="button" className="btn-secondary" onClick={onClose}>
            Hủy
          </button>
          <button type="button" className="btn-primary" onClick={handleSave}>
            {editService ? 'Lưu' : 'Thêm'}
          </button>
        </div>
      </div>
    </div>
  )
}
