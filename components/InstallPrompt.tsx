'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null)
  const [showInstall, setShowInstall] = useState(false)

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e)
      setShowInstall(true)
    }

    window.addEventListener('beforeinstallprompt', handler)

    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setShowInstall(false)
    }

    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  const handleInstall = async () => {
    if (!deferredPrompt) {
      alert('Untuk menginstall aplikasi:\n\n' +
        'Desktop: Klik icon ⊕ di address bar\n' +
        'Android: Menu → Add to Home Screen\n' +
        'iOS: Share → Add to Home Screen')
      return
    }

    deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice
    
    if (outcome === 'accepted') {
      setShowInstall(false)
    }
    
    setDeferredPrompt(null)
  }

  if (!showInstall) return null

  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 animate-in slide-in-from-top">
      <div className="bg-white rounded-lg shadow-xl border border-gray-200 p-4 flex items-center gap-4 max-w-md">
        <div className="flex-shrink-0">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
            <svg
              className="w-6 h-6 text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
              />
            </svg>
          </div>
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900">Install Aplikasi</h3>
          <p className="text-sm text-gray-600">Akses lebih cepat dari home screen</p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={() => setShowInstall(false)}
            variant="outline"
            size="sm"
          >
            Nanti
          </Button>
          <Button
            onClick={handleInstall}
            size="sm"
            className="bg-blue-600 hover:bg-blue-700"
          >
            Install
          </Button>
        </div>
      </div>
    </div>
  )
}
