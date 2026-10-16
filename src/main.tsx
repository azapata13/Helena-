import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

// iPad home-screen apps are long-lived: check for a newly deployed build when reopened.
const builtVersion = import.meta.env.VITE_APP_VERSION
if (import.meta.env.PROD && builtVersion) {
  let checking = false
  async function checkForUpdate() {
    if (checking || document.visibilityState === 'hidden' || !document.querySelector('.app-shell')) return
    checking = true
    try {
      const response = await fetch(`/version.json?t=${Date.now()}`, { cache: 'no-store' })
      if (!response.ok) return
      const published = (await response.json()) as { version?: string }
      if (!published.version || published.version === builtVersion) return
      const lastReload = sessionStorage.getItem('helena-update-reload')
      if (lastReload === published.version) return // Avoid a reload loop if a CDN remains stale.
      sessionStorage.setItem('helena-update-reload', published.version)
      const url = new URL(window.location.href)
      url.searchParams.set('v', published.version.slice(0, 12))
      window.location.replace(url.toString())
    } catch {
      // Offline: continue using the current app and retry when online.
    } finally {
      checking = false
    }
  }
  window.addEventListener('pageshow', () => void checkForUpdate())
  window.addEventListener('focus', () => void checkForUpdate())
  window.addEventListener('online', () => void checkForUpdate())
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') void checkForUpdate()
  })
  window.setInterval(() => void checkForUpdate(), 60_000)
  void checkForUpdate()
}


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
