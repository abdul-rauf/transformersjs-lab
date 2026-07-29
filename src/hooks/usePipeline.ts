import { useCallback, useEffect, useRef, useState } from 'react'
import { isPipelineCached, loadPipeline } from '@/ai/pipelines/loader'
import { emptyMetric, getMetric, saveMetric } from '@/ai/metricsStore'
import { getSelectedModelId, MODEL_SELECTION_EVENT } from '@/ai/modelSelection'
import { measureAsync } from '@/lib/format'
import type { DeviceBackend, PerformanceMetrics, ProgressStatus, TaskId } from '@/types'

export function usePipeline(taskId: TaskId) {
  const [modelId, setModelId] = useState(() => getSelectedModelId(taskId))
  const [loading, setLoading] = useState(false)
  const [running, setRunning] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [progress, setProgress] = useState<ProgressStatus | null>(null)
  const [ready, setReady] = useState(() => isPipelineCached(taskId, 'unknown', modelId))
  const [metrics, setMetrics] = useState<PerformanceMetrics>(
    () => getMetric(taskId) ?? emptyMetric(taskId),
  )
  const deviceRef = useRef<DeviceBackend>(metrics.device)
  const modelIdRef = useRef(modelId)

  useEffect(() => {
    const sync = () => {
      const next = getSelectedModelId(taskId)
      modelIdRef.current = next
      setModelId(next)
      setReady(isPipelineCached(taskId, 'unknown', next))
      setError(null)
      setProgress(null)
      setMetrics(getMetric(taskId) ?? emptyMetric(taskId))
    }
    sync()
    window.addEventListener(MODEL_SELECTION_EVENT, sync)
    return () => window.removeEventListener(MODEL_SELECTION_EVENT, sync)
  }, [taskId])

  const setBusy = useCallback(
    (busy: boolean) => {
      window.dispatchEvent(
        new CustomEvent('browser-ai-busy', { detail: { taskId, busy } }),
      )
    },
    [taskId],
  )

  const ensureLoaded = useCallback(async () => {
    setError(null)
    const activeModelId = modelIdRef.current
    const already = isPipelineCached(taskId, deviceRef.current, activeModelId)
    setLoading(true)
    setProgress({
      status: already ? 'Warm loading from memory…' : `Downloading / loading ${activeModelId}…`,
    })
    try {
      const { durationMs, result } = await measureAsync(() =>
        loadPipeline(taskId, (p) => setProgress(p), undefined, activeModelId),
      )
      deviceRef.current = result.device
      const prev = getMetric(taskId) ?? emptyMetric(taskId, result.device)
      const next: PerformanceMetrics = {
        ...prev,
        taskId,
        device: result.device,
        timestamp: Date.now(),
        ...(already ? { warmLoadMs: durationMs } : { coldLoadMs: durationMs }),
      }
      setMetrics(next)
      saveMetric(next)
      setReady(true)
      setProgress({ status: 'ready' })
      return result.pipeline
    } catch (e) {
      const message = e instanceof Error ? e.message : String(e)
      setError(message)
      setReady(false)
      throw e
    } finally {
      setLoading(false)
    }
  }, [taskId])

  const preWarm = useCallback(async () => {
    setBusy(true)
    try {
      await ensureLoaded()
    } catch {
      // error already set on hook state
    } finally {
      setBusy(false)
    }
  }, [ensureLoaded, setBusy])

  const run = useCallback(
    async <T,>(
      fn: (pipeline: unknown) => Promise<T>,
    ): Promise<{ result: T; inferenceMs: number } | null> => {
      setRunning(true)
      setError(null)
      setBusy(true)
      try {
        const pipeline = await ensureLoaded()
        const { result, durationMs } = await measureAsync(() => fn(pipeline))
        const prev = getMetric(taskId) ?? emptyMetric(taskId)
        const next: PerformanceMetrics = {
          ...prev,
          inferenceMs: durationMs,
          timestamp: Date.now(),
        }
        setMetrics(next)
        saveMetric(next)
        return { result, inferenceMs: durationMs }
      } catch (e) {
        const message = e instanceof Error ? e.message : String(e)
        setError(message)
        return null
      } finally {
        setRunning(false)
        setBusy(false)
      }
    },
    [ensureLoaded, setBusy, taskId],
  )

  return {
    loading,
    running,
    error,
    progress,
    metrics,
    ready,
    modelId,
    ensureLoaded,
    preWarm,
    run,
    busy: loading || running,
  }
}
