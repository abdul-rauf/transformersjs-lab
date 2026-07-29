import type { DeviceCapability } from '@/hooks/deviceCapability'
import type { TaskId } from '@/types'
import { getModel } from '@/ai/registry'

export interface HubModelOption {
  id: string
  downloads: number
  likes: number
  pipelineTag: string
  /** Heuristic suitability for this device */
  fit: 'recommended' | 'ok' | 'heavy'
  label: string
  isDefault?: boolean
}

interface HfModelRow {
  id: string
  downloads?: number
  likes?: number
  pipeline_tag?: string
  tags?: string[]
}

const TASK_PIPELINE_TAG: Record<TaskId, string> = {
  'text-classification': 'text-classification',
  embeddings: 'feature-extraction',
  summarization: 'summarization',
  'question-answering': 'question-answering',
  translation: 'translation',
  'text-generation': 'text-generation',
  'image-classification': 'image-classification',
  'speech-recognition': 'automatic-speech-recognition',
}

const HEAVY_PATTERNS =
  /\b(7b|8b|13b|14b|30b|70b|large-v3|large-v2|xlarge|xxl|whisper-large|whisper-medium)\b/i
const LIGHT_PATTERNS =
  /\b(tiny|mini|small|distil|nano|0\.5b|135m|360m|mobilebert|minilm)\b/i
const PREFERRED_ORGS = ['Xenova/', 'onnx-community/', 'HuggingFaceTB/', 'Xenova']

function scoreFit(modelId: string, capability: DeviceCapability | null): HubModelOption['fit'] {
  const id = modelId.toLowerCase()
  const mem = capability?.deviceMemoryGB
  const hasGpu = Boolean(capability?.webgpu)

  if (HEAVY_PATTERNS.test(id)) {
    if (!hasGpu || (mem != null && mem < 8)) return 'heavy'
    return 'ok'
  }
  if (LIGHT_PATTERNS.test(id) || PREFERRED_ORGS.some((o) => modelId.startsWith(o))) {
    return 'recommended'
  }
  if (mem != null && mem <= 4 && !hasGpu) return 'heavy'
  if (mem != null && mem <= 4) return 'ok'
  return 'ok'
}

function displayLabel(id: string, isDefault: boolean, fit: HubModelOption['fit']): string {
  const bits: string[] = [id]
  if (isDefault) bits.push('(default)')
  if (fit === 'recommended') bits.push('· recommended')
  if (fit === 'heavy') bits.push('· may be heavy')
  return bits.join(' ')
}

export function getPipelineTagForTask(taskId: TaskId): string {
  return TASK_PIPELINE_TAG[taskId]
}

export async function fetchHubModelsForTask(
  taskId: TaskId,
  capability: DeviceCapability | null,
  limit = 40,
): Promise<HubModelOption[]> {
  const pipelineTag = getPipelineTagForTask(taskId)
  const defaultModel = getModel(taskId)
  const url = new URL('https://huggingface.co/api/models')
  url.searchParams.set('filter', 'transformers.js')
  url.searchParams.set('pipeline_tag', pipelineTag)
  url.searchParams.set('sort', 'downloads')
  url.searchParams.set('direction', '-1')
  url.searchParams.set('limit', String(limit))

  let rows: HfModelRow[] = []
  try {
    const res = await fetch(url.toString())
    if (res.ok) {
      rows = (await res.json()) as HfModelRow[]
    }
  } catch {
    rows = []
  }

  // Keep only models that actually advertise transformers.js compatibility
  rows = rows.filter(
    (r) =>
      Array.isArray(r.tags) &&
      (r.tags.includes('transformers.js') || r.tags.includes('onnx')),
  )

  const byId = new Map<string, HubModelOption>()

  // Always include the lab default first
  {
    const fit = scoreFit(defaultModel.modelId, capability)
    byId.set(defaultModel.modelId, {
      id: defaultModel.modelId,
      downloads: Number.MAX_SAFE_INTEGER,
      likes: 0,
      pipelineTag,
      fit: 'recommended',
      isDefault: true,
      label: displayLabel(defaultModel.modelId, true, fit === 'heavy' ? 'ok' : 'recommended'),
    })
  }

  for (const row of rows) {
    if (!row?.id || byId.has(row.id)) continue
    // Prefer known-good browser exporters; still allow others ranked lower
    const fit = scoreFit(row.id, capability)
    byId.set(row.id, {
      id: row.id,
      downloads: row.downloads ?? 0,
      likes: row.likes ?? 0,
      pipelineTag: row.pipeline_tag ?? pipelineTag,
      fit,
      label: displayLabel(row.id, false, fit),
    })
  }

  const all = [...byId.values()]

  // Sort: default first, then recommended, then by downloads; push heavy to bottom
  all.sort((a, b) => {
    if (a.isDefault && !b.isDefault) return -1
    if (!a.isDefault && b.isDefault) return 1
    const fitRank = { recommended: 0, ok: 1, heavy: 2 }
    if (fitRank[a.fit] !== fitRank[b.fit]) return fitRank[a.fit] - fitRank[b.fit]
    return b.downloads - a.downloads
  })

  // On constrained devices, hide most "heavy" options (keep a couple for education)
  const mem = capability?.deviceMemoryGB
  const constrained = Boolean(mem != null && mem <= 4 && !capability?.webgpu)
  if (constrained) {
    const light = all.filter((m) => m.fit !== 'heavy' || m.isDefault)
    const heavySample = all.filter((m) => m.fit === 'heavy' && !m.isDefault).slice(0, 3)
    return [...light, ...heavySample].slice(0, 25)
  }

  return all.slice(0, 30)
}
