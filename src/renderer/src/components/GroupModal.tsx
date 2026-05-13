import { useState, useEffect } from 'react'
import { useAppStore } from '../store/useAppStore'
import { X } from 'lucide-react'

interface GroupModalProps {
  isOpen: boolean
  onClose: () => void
  editGroup?: { id: string; name: string } | null
}

export function GroupModal({ isOpen, onClose, editGroup }: GroupModalProps) {
  const addGroup = useAppStore((s) => s.addGroup)
  const updateGroup = useAppStore((s) => s.updateGroup)
  const deleteGroup = useAppStore((s) => s.deleteGroup)

  const [name, setName] = useState('')

  useEffect(() => {
    if (editGroup) {
      setName(editGroup.name)
    } else {
      setName('')
    }
  }, [editGroup, isOpen])

  if (!isOpen) return null

  const handleSave = async (): Promise<void> => {
    if (!name.trim()) return
    if (editGroup) {
      await updateGroup(editGroup.id, { name: name.trim() })
    } else {
      await addGroup(name.trim())
    }
    onClose()
  }

  const handleDelete = async (): Promise<void> => {
    if (editGroup) {
      await deleteGroup(editGroup.id)
      onClose()
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent): void => {
    if (e.key === 'Enter') {
      handleSave()
    } else if (e.key === 'Escape') {
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
        className="relative bg-surface-1 border border-border rounded-2xl p-7 w-full max-w-sm shadow-2xl animate-scale-in mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-lg font-semibold text-text-primary">
            {editGroup ? 'Chỉnh sửa nhóm' : 'Tạo nhóm mới'}
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center cursor-pointer bg-transparent border-none text-text-muted hover:text-text-primary hover:bg-glass-hover transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div>
          <label className="text-xs font-medium text-text-secondary mb-2 block">Tên nhóm</label>
          <input
            className="input-field"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="VD: Công việc, Học tập..."
            autoFocus
          />
        </div>

        <div className="flex items-center gap-3 mt-6">
          {editGroup && (
            <button type="button" className="btn-danger" onClick={handleDelete}>
              Xóa
            </button>
          )}
          <div className="flex-1" />
          <button type="button" className="btn-secondary" onClick={onClose}>
            Hủy
          </button>
          <button type="button" className="btn-primary" onClick={handleSave}>
            {editGroup ? 'Lưu' : 'Tạo'}
          </button>
        </div>
      </div>
    </div>
  )
}
