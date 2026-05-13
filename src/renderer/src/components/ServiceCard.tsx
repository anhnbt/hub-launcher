import type { Service } from '../../../shared/types'
import { useAppStore } from '../store/useAppStore'
import { Pencil, Trash2, ExternalLink, Terminal, Check } from 'lucide-react'

interface ServiceCardProps {
  service: Service
  viewMode: 'grid' | 'list'
  onEdit: (service: Service) => void
  onDelete: (service: Service) => void
  manageMode: boolean
  isSelected: boolean
  onToggleSelect: (id: string) => void
}

export function ServiceCard({
  service,
  viewMode,
  onEdit,
  onDelete,
  manageMode,
  isSelected,
  onToggleSelect
}: ServiceCardProps) {
  const launchService = useAppStore((s) => s.launchService)

  const statusColor =
    service.status === 'online'
      ? 'bg-online'
      : service.status === 'offline'
        ? 'bg-offline'
        : 'bg-unknown'

  const statusAnimation = service.status === 'online' ? 'status-online' : ''
  const statusLabel =
    service.status === 'online'
      ? 'Hoạt động'
      : service.status === 'offline'
        ? 'Ngừng'
        : '—'

  const handleClick = (): void => {
    if (manageMode) {
      onToggleSelect(service.id)
      return
    }
    launchService(service)
  }

  if (viewMode === 'list') {
    return (
      <div
        className={`glass-card flex items-center gap-4 px-5 py-4 cursor-pointer animate-fade-in-up group relative
          ${manageMode && isSelected ? 'ring-2 ring-accent border-accent' : ''}
          ${manageMode ? 'select-none' : ''}`}
        onClick={handleClick}
      >
        {/* Manage checkbox */}
        {manageMode && (
          <div
            className={`w-5 h-5 rounded flex items-center justify-center shrink-0 border transition-all
              ${isSelected ? 'bg-accent border-accent' : 'border-border bg-surface-2'}`}
          >
            {isSelected && <Check className="w-3.5 h-3.5 text-white" />}
          </div>
        )}

        {/* Icon */}
        <div className="w-10 h-10 rounded-xl bg-surface-2 flex items-center justify-center text-xl shrink-0">
          {service.iconType === 'emoji' ? (
            service.iconValue
          ) : (
            <img src={service.iconValue} alt="" className="w-6 h-6 rounded" />
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="text-sm font-medium text-text-primary truncate">{service.name}</div>
          <div className="text-xs text-text-muted truncate mt-0.5 flex items-center gap-1">
            {service.type === 'url' ? (
              <ExternalLink className="w-3 h-3 shrink-0" />
            ) : (
              <Terminal className="w-3 h-3 shrink-0" />
            )}
            {service.target}
          </div>
        </div>

        {/* Status */}
        {service.enableHealthCheck && !manageMode && (
          <div className="flex items-center gap-2 shrink-0">
            <div className={`w-2.5 h-2.5 rounded-full ${statusColor} ${statusAnimation}`} />
            <span className="text-xs text-text-muted">{statusLabel}</span>
          </div>
        )}

        {/* Hover actions */}
        {!manageMode && (
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                onEdit(service)
              }}
              className="action-btn"
              title="Chỉnh sửa"
            >
              <Pencil className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                onDelete(service)
              }}
              className="action-btn action-btn-danger"
              title="Xóa"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>
    )
  }

  // Grid view
  return (
    <div
      className={`glass-card p-5 cursor-pointer animate-fade-in-up flex flex-col items-center text-center relative group
        ${manageMode && isSelected ? 'ring-2 ring-accent border-accent' : ''}
        ${manageMode ? 'select-none' : ''}`}
      onClick={handleClick}
    >
      {/* Manage checkbox */}
      {manageMode && (
        <div
          className={`absolute top-2.5 left-2.5 w-5 h-5 rounded flex items-center justify-center border transition-all z-10
            ${isSelected ? 'bg-accent border-accent' : 'border-border bg-surface-2/80'}`}
        >
          {isSelected && <Check className="w-3.5 h-3.5 text-white" />}
        </div>
      )}

      {/* Health status indicator */}
      {service.enableHealthCheck && !manageMode && (
        <div
          className={`absolute top-3 left-3 w-2.5 h-2.5 rounded-full ${statusColor} ${statusAnimation}`}
          title={statusLabel}
        />
      )}

      {/* Hover actions (top-right) */}
      {!manageMode && (
        <div className="absolute top-2 right-2 flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity z-10">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              onEdit(service)
            }}
            className="action-btn"
            title="Chỉnh sửa"
          >
            <Pencil className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              onDelete(service)
            }}
            className="action-btn action-btn-danger"
            title="Xóa"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Icon */}
      <div className="w-14 h-14 rounded-2xl bg-surface-2 flex items-center justify-center text-3xl mb-3">
        {service.iconType === 'emoji' ? (
          service.iconValue
        ) : (
          <img src={service.iconValue} alt="" className="w-8 h-8 rounded-lg" />
        )}
      </div>

      {/* Name */}
      <div className="text-sm font-medium text-text-primary truncate w-full">{service.name}</div>
    </div>
  )
}
