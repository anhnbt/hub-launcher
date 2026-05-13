import { useAppStore } from '../store/useAppStore'
import { ServiceCard } from './ServiceCard'
import { Plus, Pencil, Rocket } from 'lucide-react'
import type { Service } from '../../../../shared/types'

interface ServiceBoardProps {
  onEditService: (service: Service) => void
  onAddService: (groupId: string) => void
  onEditGroup: (group: { id: string; name: string }) => void
  searchQuery: string
  manageMode: boolean
  selectedIds: Set<string>
  onToggleSelect: (id: string) => void
  onDeleteService: (service: Service) => void
}

export function ServiceBoard({
  onEditService,
  onAddService,
  onEditGroup,
  searchQuery,
  manageMode,
  selectedIds,
  onToggleSelect,
  onDeleteService
}: ServiceBoardProps): JSX.Element {
  const groups = useAppStore((s) => s.groups)
  const services = useAppStore((s) => s.services)
  const viewMode = useAppStore((s) => s.settings.viewMode)

  // Filter services by search query
  const filteredServices = searchQuery.trim()
    ? services.filter(
        (s) =>
          s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          s.target.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : services

  return (
    <div className="flex-1 overflow-y-auto px-6 py-4 space-y-8">
      {groups.map((group) => {
        const groupServices = filteredServices
          .filter((s) => s.groupId === group.id)
          .sort((a, b) => a.order - b.order)

        // If searching and no services match in this group, hide the group
        if (searchQuery.trim() && groupServices.length === 0) return null

        return (
          <section key={group.id} className="animate-fade-in-up">
            {/* Group header */}
            <div className="flex items-center justify-between mb-4">
              <button
                onClick={() => onEditGroup(group)}
                className="flex items-center gap-2 group/header cursor-pointer bg-transparent border-none"
              >
                <h2 className="text-lg font-semibold text-text-primary">{group.name}</h2>
                <span className="text-xs text-text-muted bg-surface-2 px-2 py-0.5 rounded-full">
                  {groupServices.length}
                </span>
                <Pencil className="w-3.5 h-3.5 text-text-muted opacity-0 group-hover/header:opacity-100 transition-opacity" />
              </button>
              {!manageMode && (
                <button
                  onClick={() => onAddService(group.id)}
                  className="text-sm text-accent-light hover:text-accent transition-colors cursor-pointer bg-transparent border-none flex items-center gap-1"
                >
                  <Plus className="w-4 h-4" />
                  <span>Thêm</span>
                </button>
              )}
            </div>

            {/* Services */}
            {groupServices.length === 0 ? (
              <div className="glass-card p-8 text-center">
                <p className="text-text-muted text-sm">Chưa có dịch vụ nào trong nhóm này.</p>
                <button
                  onClick={() => onAddService(group.id)}
                  className="btn-primary mt-3 text-sm inline-flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  Thêm dịch vụ
                </button>
              </div>
            ) : viewMode === 'grid' ? (
              <div className="grid grid-cols-[repeat(auto-fill,minmax(130px,1fr))] gap-3">
                {groupServices.map((service) => (
                  <ServiceCard
                    key={service.id}
                    service={service}
                    viewMode="grid"
                    onEdit={onEditService}
                    onDelete={onDeleteService}
                    manageMode={manageMode}
                    isSelected={selectedIds.has(service.id)}
                    onToggleSelect={onToggleSelect}
                  />
                ))}
              </div>
            ) : (
              <div className="space-y-2">
                {groupServices.map((service) => (
                  <ServiceCard
                    key={service.id}
                    service={service}
                    viewMode="list"
                    onEdit={onEditService}
                    onDelete={onDeleteService}
                    manageMode={manageMode}
                    isSelected={selectedIds.has(service.id)}
                    onToggleSelect={onToggleSelect}
                  />
                ))}
              </div>
            )}
          </section>
        )
      })}

      {/* Search empty state */}
      {searchQuery.trim() && filteredServices.length === 0 && (
        <div className="flex flex-col items-center justify-center h-full text-center gap-3 pt-20">
          <div className="text-5xl opacity-50">🔍</div>
          <h2 className="text-lg font-semibold text-text-primary">Không tìm thấy kết quả</h2>
          <p className="text-text-muted text-sm max-w-sm">
            Không có dịch vụ nào khớp với &quot;{searchQuery}&quot;
          </p>
        </div>
      )}

      {/* Empty state */}
      {groups.length === 0 && !searchQuery.trim() && (
        <div className="flex flex-col items-center justify-center h-full text-center gap-4">
          <Rocket className="w-16 h-16 text-accent opacity-60" />
          <h2 className="text-xl font-semibold text-text-primary">Chào mừng đến Hub Launcher</h2>
          <p className="text-text-muted text-sm max-w-sm">
            Tạo một nhóm để sắp xếp các dịch vụ và bắt đầu mở chúng nhanh chóng.
          </p>
        </div>
      )}
    </div>
  )
}
