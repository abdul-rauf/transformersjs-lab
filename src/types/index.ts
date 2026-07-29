export type DeviceBackend = 'webgpu' | 'wasm' | 'unknown'

export type TaskId =
  | 'text-classification'
  | 'embeddings'
  | 'summarization'
  | 'question-answering'
  | 'translation'
  | 'text-generation'
  | 'image-classification'
  | 'speech-recognition'

export type ModelDtype = 'q8' | 'q4' | 'fp16' | 'fp32'

export interface ModelInfo {
  id: TaskId
  displayName: string
  modelId: string
  task: string
  downloadSizeMB: number
  memoryMB: number
  inputType: string
  outputType: string
  hfUrl: string
  description: string
  /** Prefer fp32 for models broken by ORT 1.25 MatMulNBits QDQ fusion (e.g. Opus-MT). */
  preferredDtype?: ModelDtype
}

export interface PerformanceMetrics {
  taskId: TaskId
  coldLoadMs: number | null
  warmLoadMs: number | null
  inferenceMs: number | null
  device: DeviceBackend
  timestamp: number
}

export interface ProgressStatus {
  status: string
  file?: string
  progress?: number
  loaded?: number
  total?: number
}

export interface CapabilityContent {
  id: TaskId
  title: string
  overview: {
    what: string
    why: string
    how: string
  }
  enterpriseUseCases: { title: string; description: string }[]
  limitations: string[]
  explainSummary: string
  pipelineLabels?: string[]
}

export interface NavItem {
  title: string
  href: string
  section?: string
}
