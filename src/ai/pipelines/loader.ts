import type { DeviceBackend, ModelDtype, ProgressStatus, TaskId } from '@/types'
import { getModel } from '@/ai/registry'
import { getSelectedModelId } from '@/ai/modelSelection'
import { detectPreferredDevice } from '@/hooks/deviceCapability'

type ProgressCallback = (status: ProgressStatus) => void

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyPipeline = any

const pipelineCache = new Map<string, AnyPipeline>()
const loadPromises = new Map<
  string,
  Promise<{ pipeline: AnyPipeline; device: DeviceBackend; modelId: string }>
>()

function isMatMulNBitsError(err: unknown): boolean {
  const msg = err instanceof Error ? err.message : String(err)
  return (
    msg.includes('TransposeDQWeightsForMatMulNBits') ||
    msg.includes('Missing required scale') ||
    msg.includes("Can't create a session")
  )
}

function resolveModel(taskId: TaskId, modelIdOverride?: string) {
  const base = getModel(taskId)
  const modelId = modelIdOverride ?? getSelectedModelId(taskId)
  return { ...base, modelId }
}

export async function loadPipeline(
  taskId: TaskId,
  onProgress?: ProgressCallback,
  preferredDevice?: DeviceBackend,
  modelIdOverride?: string,
): Promise<{ pipeline: AnyPipeline; device: DeviceBackend; modelId: string }> {
  const model = resolveModel(taskId, modelIdOverride)
  const wantDevice =
    preferredDevice && preferredDevice !== 'unknown'
      ? preferredDevice
      : await detectPreferredDevice()

  for (const device of [wantDevice, 'wasm', 'webgpu'] as DeviceBackend[]) {
    const key = `${model.modelId}:${device}`
    if (pipelineCache.has(key)) {
      return { pipeline: pipelineCache.get(key)!, device, modelId: model.modelId }
    }
  }

  const inflightKey = model.modelId
  if (loadPromises.has(inflightKey)) {
    return loadPromises.get(inflightKey)!
  }

  const promise = (async () => {
    const { pipeline } = await import('@huggingface/transformers')

    const tryLoad = async (device: DeviceBackend, dtype: ModelDtype) => {
      const options: Record<string, unknown> = {
        progress_callback: (info: ProgressStatus) => onProgress?.(info),
        dtype,
        session_options: {
          graphOptimizationLevel: 'basic',
        },
      }
      if (device === 'webgpu') {
        options.device = 'webgpu'
      }
      const pipe = await pipeline(model.task as never, model.modelId, options as never)
      pipelineCache.set(`${model.modelId}:${device}`, pipe)
      return { pipeline: pipe, device, modelId: model.modelId }
    }

    const primaryDevice = wantDevice === 'unknown' ? 'wasm' : wantDevice
    const primaryDtype: ModelDtype =
      model.preferredDtype ?? (primaryDevice === 'webgpu' ? 'fp32' : 'q8')

    // Opus / Marian shared-embedding models: force fp32 when id looks like opus-mt
    const forceFp32 =
      /opus-mt|marian/i.test(model.modelId) || model.preferredDtype === 'fp32'
    const dtypeToTry: ModelDtype = forceFp32 ? 'fp32' : primaryDtype

    try {
      return await tryLoad(primaryDevice, dtypeToTry)
    } catch (err) {
      if (dtypeToTry !== 'fp32' && isMatMulNBitsError(err)) {
        onProgress?.({
          status: 'Quantized model incompatible — retrying with fp32…',
        })
        try {
          return await tryLoad(primaryDevice, 'fp32')
        } catch (fpErr) {
          if (primaryDevice === 'webgpu') {
            onProgress?.({ status: 'WebGPU failed — falling back to WASM fp32…' })
            return await tryLoad('wasm', 'fp32')
          }
          throw fpErr
        }
      }
      if (primaryDevice === 'webgpu') {
        onProgress?.({ status: 'WebGPU failed — falling back to WASM…' })
        try {
          return await tryLoad('wasm', forceFp32 ? 'fp32' : (model.preferredDtype ?? 'q8'))
        } catch (wasmErr) {
          if (isMatMulNBitsError(wasmErr)) {
            onProgress?.({ status: 'Retrying WASM with fp32…' })
            return await tryLoad('wasm', 'fp32')
          }
          throw wasmErr
        }
      }
      throw err
    }
  })()

  loadPromises.set(inflightKey, promise)
  try {
    return await promise
  } finally {
    loadPromises.delete(inflightKey)
  }
}

export function isPipelineCached(
  taskId: TaskId,
  _device: DeviceBackend,
  modelIdOverride?: string,
): boolean {
  const model = resolveModel(taskId, modelIdOverride)
  return (
    pipelineCache.has(`${model.modelId}:wasm`) ||
    pipelineCache.has(`${model.modelId}:webgpu`) ||
    pipelineCache.has(`${model.modelId}:unknown`)
  )
}

export function clearPipelineCache(): void {
  pipelineCache.clear()
}
