import { useEffect, useState } from 'react'
import { DownloadCloud, RefreshCw, X, AlertCircle, Check } from 'lucide-react'

export function AutoUpdateBanner() {
  const [status, setStatus] = useState<string>('')
  const [progress, setProgress] = useState<number>(0)
  const [errorMsg, setErrorMsg] = useState<string>('')
  const [visible, setVisible] = useState<boolean>(false)

  useEffect(() => {
    console.log('DEBUG: AutoUpdateBanner mounted')
    // Check for updates on startup
    window.api.checkForUpdate?.()

    const cleanup = window.api.onUpdateStatus?.((update) => {
      console.log('Update Status Received:', update.status, update.data)
      setStatus(update.status)
      const isManual = update.data?.manual

      if (update.status === 'checking') {
        if (isManual) setVisible(true)
      } else if (update.status === 'available') {
        setVisible(true)
      } else if (update.status === 'not-available') {
        if (isManual) {
          setVisible(true)
          setTimeout(() => setVisible(false), 3000)
        } else {
          setVisible(false)
        }
      } else if (update.status === 'downloading') {
        setVisible(true)
        if (update.data && update.data.percent) {
          setProgress(Math.round(update.data.percent))
        }
      } else if (update.status === 'downloaded') {
        setVisible(true)
      } else if (update.status === 'error') {
        setVisible(true)
        setErrorMsg(update.data?.message || update.data || 'Unknown error occurred')
      } else if (update.status === 'test-success') {
        setVisible(true)
        setTimeout(() => setVisible(false), 3000)
      }
    })

    return cleanup
  }, [])

  if (!visible) return null

  const handleDownload = () => {
    window.api.downloadUpdate?.()
  }

  const handleInstall = () => {
    window.api.quitAndInstall?.()
  }

  return (
    <div className="fixed top-0 left-0 right-0 z-[100] bg-surface-2 border-b border-border p-3 flex items-center justify-between text-sm animate-fade-in shadow-xl">
      <div className="flex items-center gap-3">
        {status === 'checking' && (
          <>
            <RefreshCw className="w-4 h-4 text-accent animate-spin" />
            <span className="text-text-primary">Đang kiểm tra cập nhật...</span>
          </>
        )}

        {status === 'not-available' && (
          <span className="text-text-secondary">Bạn đang dùng phiên bản mới nhất.</span>
        )}

        {status === 'available' && (
          <>
            <DownloadCloud className="w-4 h-4 text-accent animate-pulse" />
            <span className="text-text-primary">Có bản cập nhật mới!</span>
            <button
              onClick={handleDownload}
              className="ml-2 px-3 py-1 bg-accent text-white rounded-md text-xs hover:bg-accent-hover transition-colors"
            >
              Tải xuống
            </button>
          </>
        )}

        {status === 'downloading' && (
          <>
            <RefreshCw className="w-4 h-4 text-accent animate-spin" />
            <span className="text-text-primary">Đang tải xuống bản cập nhật... {progress}%</span>
            <div className="w-24 h-1.5 bg-surface-3 rounded-full overflow-hidden ml-2">
              <div
                className="h-full bg-accent transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </>
        )}

        {status === 'downloaded' && (
          <>
            <DownloadCloud className="w-4 h-4 text-green-500" />
            <span className="text-text-primary text-green-500 font-medium">Đã tải xong bản cập nhật!</span>
            <button
              onClick={handleInstall}
              className="ml-2 px-3 py-1 bg-online text-white rounded-md text-xs hover:bg-online-hover transition-colors shadow-sm"
            >
              Khởi động lại & Cài đặt
            </button>
          </>
        )}

        {status === 'error' && (
          <>
            <AlertCircle className="w-4 h-4 text-red-500" />
            <span className="text-red-500">Lỗi cập nhật: {errorMsg}</span>
          </>
        )}

        {status === 'test-success' && (
          <>
            <Check className="w-4 h-4 text-green-500" />
            <span className="text-text-primary">Đã gửi thông báo thử nghiệm thành công!</span>
          </>
        )}
      </div>

      <button
        onClick={() => setVisible(false)}
        className="p-1 rounded-md hover:bg-surface-3 text-text-muted hover:text-text-primary transition-colors"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  )
}
