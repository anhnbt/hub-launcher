import { useAppStore } from '../store/useAppStore'
import {
  LayoutGrid,
  List,
  FolderPlus,
  Settings,
  Search,
  CheckSquare,
  X,
  Trash2,
  Rocket
} from 'lucide-react'
import { useRef, useEffect } from 'react'

interface ToolbarProps {
  onOpenSettings: () => void
  onAddGroup: () => void
  searchQuery: string
  onSearchChange: (q: string) => void
  manageMode: boolean
  onToggleManage: () => void
  selectedCount: number
  onDeleteSelected: () => void
}

export function Toolbar({
  onOpenSettings,
  onAddGroup,
  searchQuery,
  onSearchChange,
  manageMode,
  onToggleManage,
  selectedCount,
  onDeleteSelected
}: ToolbarProps) {
  const settings = useAppStore((s) => s.settings)
  const updateSettings = useAppStore((s) => s.updateSettings)
  const searchRef = useRef<HTMLInputElement>(null)

  // Cmd+K / Ctrl+K to focus search
  useEffect(() => {
    const handler = (e: KeyboardEvent): void => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        searchRef.current?.focus()
      }
      if (e.key === 'Escape' && document.activeElement === searchRef.current) {
        onSearchChange('')
        searchRef.current?.blur()
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onSearchChange])

  // Manage mode toolbar
  if (manageMode) {
    return (
      <div className="titlebar-drag h-14 flex items-center px-5 border-b border-border bg-accent/10 backdrop-blur-xl shrink-0">
        <div className="w-20 shrink-0" />

        <div className="flex-1 flex items-center gap-3">
          <CheckSquare className="w-5 h-5 text-accent" />
          <span className="text-sm font-medium text-text-primary">
            Đã chọn {selectedCount} mục
          </span>
        </div>

        <div className="titlebar-no-drag flex items-center gap-2">
          {selectedCount > 0 && (
            <button
              type="button"
              onClick={onDeleteSelected}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium cursor-pointer bg-red-600 text-white border-none hover:bg-red-500 transition-all"
            >
              <Trash2 className="w-4 h-4" />
              Xóa ({selectedCount})
            </button>
          )}
          <button
            type="button"
            onClick={onToggleManage}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium cursor-pointer bg-surface-2 text-text-secondary border border-border hover:bg-glass-hover transition-all"
          >
            <X className="w-4 h-4" />
            Xong
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="titlebar-drag h-14 flex items-center px-5 border-b border-border bg-surface-1/50 backdrop-blur-xl shrink-0">
      {/* macOS traffic light offset */}
      <div className="w-20 shrink-0" />

      {/* Title */}
      <div className="flex items-center gap-2 shrink-0">
        <Rocket className="w-5 h-5 text-accent" />
        <span className="text-base font-semibold text-text-primary">Hub Launcher</span>
      </div>

      {/* Search */}
      <div className="titlebar-no-drag flex-1 flex items-center justify-center px-4">
        <div className="relative w-full max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted pointer-events-none" />
          <input
            ref={searchRef}
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Tìm kiếm... (⌘K)"
            className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-surface-2/60 border border-border text-sm text-text-primary placeholder:text-text-muted outline-none focus:border-accent focus:bg-surface-2 transition-all"
          />
        </div>
      </div>

      {/* Actions */}
      <div className="titlebar-no-drag flex items-center gap-1">
        {/* View toggle */}
        <button
          type="button"
          onClick={() =>
            updateSettings({ viewMode: settings.viewMode === 'grid' ? 'list' : 'grid' })
          }
          className="toolbar-btn"
          title={settings.viewMode === 'grid' ? 'Chuyển sang danh sách' : 'Chuyển sang lưới'}
        >
          {settings.viewMode === 'grid' ? (
            <List className="w-4 h-4" />
          ) : (
            <LayoutGrid className="w-4 h-4" />
          )}
        </button>

        {/* Manage mode */}
        <button
          type="button"
          onClick={onToggleManage}
          className="toolbar-btn"
          title="Quản lý hàng loạt"
        >
          <CheckSquare className="w-4 h-4" />
        </button>

        {/* Add group */}
        <button
          type="button"
          onClick={onAddGroup}
          className="toolbar-btn"
          title="Thêm nhóm mới"
        >
          <FolderPlus className="w-4 h-4" />
        </button>

        {/* Settings */}
        <button
          type="button"
          onClick={onOpenSettings}
          className="toolbar-btn"
          title="Cài đặt"
        >
          <Settings className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
