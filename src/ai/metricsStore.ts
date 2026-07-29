import type { DeviceBackend, PerformanceMetrics, TaskId } from '@/types'

const STORAGE_KEY = 'browser-ai-metrics'

export function loadMetrics(): PerformanceMetrics[] {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    return JSON.parse(raw) as PerformanceMetrics[]
  } catch {
    return []
  }
}

export function saveMetric(metric: PerformanceMetrics): void {
  const all = loadMetrics().filter((m) => m.taskId !== metric.taskId)
  all.push(metric)
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(all))
  window.dispatchEvent(new CustomEvent('browser-ai-metrics'))
}

export function getMetric(taskId: TaskId): PerformanceMetrics | undefined {
  return loadMetrics().find((m) => m.taskId === taskId)
}

export function emptyMetric(taskId: TaskId, device: DeviceBackend = 'unknown'): PerformanceMetrics {
  return {
    taskId,
    coldLoadMs: null,
    warmLoadMs: null,
    inferenceMs: null,
    device,
    timestamp: Date.now(),
  }
}
