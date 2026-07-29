import { useCallback, useEffect, useState } from 'react'
import type { DeviceCapability } from '@/hooks/deviceCapability'
import { getDeviceCapability } from '@/hooks/deviceCapability'

export function useDeviceCapability() {
  const [capability, setCapability] = useState<DeviceCapability | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    getDeviceCapability().then((cap) => {
      if (!cancelled) {
        setCapability(cap)
        setLoading(false)
      }
    })
    return () => {
      cancelled = true
    }
  }, [])

  return { capability, loading }
}

export function usePresentationMode() {
  const [enabled, setEnabled] = useState(() => {
    return localStorage.getItem('presentation-mode') === '1'
  })

  useEffect(() => {
    document.documentElement.classList.toggle('presentation-mode', enabled)
    localStorage.setItem('presentation-mode', enabled ? '1' : '0')
  }, [enabled])

  const toggle = useCallback(() => setEnabled((v) => !v), [])
  return { enabled, toggle, setEnabled }
}
