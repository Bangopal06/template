'use client'

export default function InstallButton() {
  const handleInstall = () => {
    alert('Untuk menginstall aplikasi:\n\n' +
      '📱 Android/Chrome:\n' +
      '1. Klik menu (⋮) → "Install app"\n' +
      '2. Atau "Add to Home Screen"\n\n' +
      '🍎 iOS/Safari:\n' +
      '1. Tap Share (⬆️)\n' +
      '2. "Add to Home Screen"\n\n' +
      '💻 Desktop:\n' +
      '1. Klik icon install (⊕) di address bar\n' +
      '2. Atau Menu → "Install Dashboard Template"')
  }

  return (
    <button
      onClick={handleInstall}
      className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
      title="Install aplikasi"
    >
      <svg
        className="w-5 h-5"
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
      <span className="hidden md:inline">Install App</span>
    </button>
  )
}
