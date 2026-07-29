export async function estimateCachedModels(): Promise<{
  supported: boolean
  cacheCount: number
  estimatedBytes: number
}> {
  if (!('caches' in window)) {
    return { supported: false, cacheCount: 0, estimatedBytes: 0 }
  }
  try {
    const keys = await caches.keys()
    let estimatedBytes = 0
    let cacheCount = 0
    for (const key of keys) {
      if (
        key.toLowerCase().includes('transformers') ||
        key.toLowerCase().includes('huggingface') ||
        key.toLowerCase().includes('onnx')
      ) {
        cacheCount += 1
        const cache = await caches.open(key)
        const requests = await cache.keys()
        for (const req of requests) {
          const res = await cache.match(req)
          if (res) {
            const len = res.headers.get('content-length')
            if (len) estimatedBytes += Number(len)
          }
        }
      }
    }
    return { supported: true, cacheCount, estimatedBytes }
  } catch {
    return { supported: true, cacheCount: 0, estimatedBytes: 0 }
  }
}
