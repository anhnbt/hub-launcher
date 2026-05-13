import { useState, useEffect } from 'react'
import { useAppStore } from './store/useAppStore'
import { Toolbar } from './components/Toolbar'
import { ServiceBoard } from './components/ServiceBoard'
import { ServiceModal } from './components/ServiceModal'
import { GroupModal } from './components/GroupModal'
import { SettingsPanel } from './components/SettingsPanel'
import { AutoUpdateBanner } from './components/AutoUpdateBanner'
import type { Service } from '../../shared/types'
import './index.css'

function App() {
  const settings = useAppStore((s) => s.settings)
  const isLoading = useAppStore((s) => s.isLoading)
  const loadAll = useAppStore((s) => s.loadAll)
  const updateServiceStatus = useAppStore((s) => s.updateServiceStatus)

  // Modal states
  const [showSettings, setShowSettings] = useState(false)
  const [showServiceModal, setShowServiceModal] = useState(false)
  const [showGroupModal, setShowGroupModal] = useState(false)
  const [editService, setEditService] = useState<Service | null>(null)
  const [editGroup, setEditGroup] = useState<{ id: string; name: string } | null>(null)
  const [defaultGroupId, setDefaultGroupId] = useState<string>('')

  // Search and manage mode states
  const [searchQuery, setSearchQuery] = useState('')
  const [manageMode, setManageMode] = useState(false)
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())

  // Load data and request notification permission on mount
  useEffect(() => {
    loadAll()
    
    // Request notification permission if it hasn't been granted or denied yet
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission()
    }
  }, [loadAll])

  // Listen for health status updates from main process
  useEffect(() => {
    if (!window?.api?.onHealthStatusUpdate) return
    
    const cleanup = window.api.onHealthStatusUpdate((data) => {
      updateServiceStatus(data.serviceId, data.status, data.lastChecked)
    })
    return cleanup
  }, [updateServiceStatus])

  // Theme class
  const themeClass = settings.theme === 'light' ? 'theme-light' : ''

  // Background style — supports both color and image
  const bgStyle: React.CSSProperties =
    settings.backgroundType === 'image'
      ? {
          backgroundImage: `url(${settings.backgroundValue})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }
      : { backgroundColor: settings.backgroundValue }

  if (isLoading) {
    return (
      <div
        className={`h-full flex items-center justify-center ${themeClass}`}
        style={bgStyle}
      >
        <div className="text-4xl animate-pulse">🚀</div>
      </div>
    )
  }

  const handleToggleSelect = (id: string) => {
    const next = new Set(selectedIds)
    if (next.has(id)) next.delete(id)
    else next.add(id)
    setSelectedIds(next)
  }

  const handleDeleteSelected = async () => {
    if (!window.api) return
    // Delete in parallel or sequentially. We'll do sequentially for simplicity
    for (const id of selectedIds) {
      await window.api.deleteService(id)
    }
    setSelectedIds(new Set())
    setManageMode(false)
    loadAll() // Reload to sync state
  }

  return (
    <div
      className={`h-full flex flex-col ${themeClass}`}
      style={bgStyle}
    >
      <AutoUpdateBanner />
      <Toolbar
        onOpenSettings={() => setShowSettings(true)}
        onAddGroup={() => {
          setEditGroup(null)
          setShowGroupModal(true)
        }}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        manageMode={manageMode}
        onToggleManage={() => {
          setManageMode(!manageMode)
          setSelectedIds(new Set())
        }}
        selectedCount={selectedIds.size}
        onDeleteSelected={handleDeleteSelected}
      />

      <ServiceBoard
        searchQuery={searchQuery}
        manageMode={manageMode}
        selectedIds={selectedIds}
        onToggleSelect={handleToggleSelect}
        onDeleteService={async (s) => {
          if (window.api) {
            await window.api.deleteService(s.id)
            loadAll()
          }
        }}
        onEditService={(service) => {
          setEditService(service)
          setDefaultGroupId(service.groupId)
          setShowServiceModal(true)
        }}
        onAddService={(groupId) => {
          setEditService(null)
          setDefaultGroupId(groupId)
          setShowServiceModal(true)
        }}
        onEditGroup={(group) => {
          setEditGroup(group)
          setShowGroupModal(true)
        }}
      />

      {/* Modals */}
      <ServiceModal
        isOpen={showServiceModal}
        onClose={() => {
          setShowServiceModal(false)
          setEditService(null)
        }}
        editService={editService}
        defaultGroupId={defaultGroupId}
      />

      <GroupModal
        isOpen={showGroupModal}
        onClose={() => {
          setShowGroupModal(false)
          setEditGroup(null)
        }}
        editGroup={editGroup}
      />

      <SettingsPanel isOpen={showSettings} onClose={() => setShowSettings(false)} />
    </div>
  )
}

export default App
