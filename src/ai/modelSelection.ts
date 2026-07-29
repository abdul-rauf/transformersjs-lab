import type { TaskId } from '@/types'
import { getModel } from '@/ai/registry'

const STORAGE_KEY = 'browser-ai-selected-models'
export const MODEL_SELECTION_EVENT = 'browser-ai-model-selection'

type SelectionMap = Partial<Record<TaskId, string>>

function readMap(): SelectionMap {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return {}
    return JSON.parse(raw) as SelectionMap
  } catch {
    return {}
  }
}

function writeMap(map: SelectionMap): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(map))
  window.dispatchEvent(new CustomEvent(MODEL_SELECTION_EVENT))
}

export function getSelectedModelId(taskId: TaskId): string {
  return readMap()[taskId] ?? getModel(taskId).modelId
}

export function setSelectedModelId(taskId: TaskId, modelId: string): void {
  const map = readMap()
  map[taskId] = modelId
  writeMap(map)
}

export function isDefaultModel(taskId: TaskId, modelId: string): boolean {
  return getModel(taskId).modelId === modelId
}
