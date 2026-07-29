import type { DeviceBackend } from '@/types'

export async function detectWebGPU(): Promise<boolean> {
  try {
    if (!('gpu' in navigator)) return false
    const gpu = (navigator as Navigator & { gpu?: { requestAdapter?: () => Promise<unknown> } }).gpu
    const adapter = await gpu?.requestAdapter?.()
    return Boolean(adapter)
  } catch {
    return false
  }
}

export function detectWasm(): boolean {
  try {
    return typeof WebAssembly === 'object' && typeof WebAssembly.instantiate === 'function'
  } catch {
    return false
  }
}

export async function detectPreferredDevice(): Promise<DeviceBackend> {
  if (await detectWebGPU()) return 'webgpu'
  if (detectWasm()) return 'wasm'
  return 'unknown'
}

export interface DeviceCapability {
  webgpu: boolean
  wasm: boolean
  preferred: DeviceBackend
  userAgent: string
  hardwareConcurrency: number
  deviceMemoryGB: number | null
}

let cached: DeviceCapability | null = null

export async function getDeviceCapability(): Promise<DeviceCapability> {
  if (cached) return cached
  const webgpu = await detectWebGPU()
  const wasm = detectWasm()
  cached = {
    webgpu,
    wasm,
    preferred: webgpu ? 'webgpu' : wasm ? 'wasm' : 'unknown',
    userAgent: navigator.userAgent,
    hardwareConcurrency: navigator.hardwareConcurrency ?? 0,
    deviceMemoryGB:
      'deviceMemory' in navigator
        ? (navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? null
        : null,
  }
  return cached
}
