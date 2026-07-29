import { useEffect, useState } from 'react'
import { loadMetrics } from '@/ai/metricsStore'
import type { PerformanceMetrics } from '@/types'

export function usePerformanceMetrics() {
  const [metrics, setMetrics] = useState<PerformanceMetrics[]>(() => loadMetrics())

  useEffect(() => {
    const refresh = () => setMetrics(loadMetrics())
    window.addEventListener('browser-ai-metrics', refresh)
    window.addEventListener('storage', refresh)
    return () => {
      window.removeEventListener('browser-ai-metrics', refresh)
      window.removeEventListener('storage', refresh)
    }
  }, [])

  return metrics
}
