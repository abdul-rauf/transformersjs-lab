import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { estimateCachedModels } from '@/ai/cache'
import { formatBytes } from '@/lib/format'
import { TermTooltip } from '@/components/education/TermTooltip'

export function BrowserStoragePage() {
  const [cacheInfo, setCacheInfo] = useState<{
    supported: boolean
    cacheCount: number
    estimatedBytes: number
  } | null>(null)

  useEffect(() => {
    estimateCachedModels().then(setCacheInfo)
  }, [])

  return (
    <div className="mx-auto max-w-4xl space-y-8 animate-fade-in-up">
      <header className="space-y-2">
        <p className="text-xs font-medium uppercase tracking-wider text-primary">Systems</p>
        <h1 className="text-3xl font-semibold tracking-tight">Browser Storage</h1>
        <p className="max-w-2xl text-muted-foreground">
          Where models live after download, how caching works, and what offline means in practice.
        </p>
      </header>

      <Card>
        <CardHeader>
          <CardTitle>Live cache probe</CardTitle>
          <CardDescription>Best-effort detection of Transformers / Hugging Face caches.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-3">
          {!cacheInfo && <p className="text-sm text-muted-foreground">Scanning Cache Storage…</p>}
          {cacheInfo && (
            <>
              <Badge variant={cacheInfo.supported ? 'success' : 'warning'}>
                Cache API {cacheInfo.supported ? 'available' : 'unavailable'}
              </Badge>
              <Badge variant="outline">{cacheInfo.cacheCount} matching caches</Badge>
              <Badge variant="secondary">
                ~{formatBytes(cacheInfo.estimatedBytes)} reported
              </Badge>
            </>
          )}
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-3">
        {[
          {
            t: 'Cache Storage',
            d: 'HTTP responses for model shards are often stored via the Cache API for fast re-fetch.',
          },
          {
            t: 'IndexedDB',
            d: 'Structured persistence used by runtimes and apps for tensors, metadata, and app state.',
          },
          {
            t: 'Memory',
            d: 'Once loaded, weights reside in WASM/WebGPU memory until the tab releases them.',
          },
        ].map((c) => (
          <Card key={c.t}>
            <CardHeader>
              <CardTitle className="text-base">{c.t}</CardTitle>
              <CardDescription>{c.d}</CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Model lifecycle</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-2">
            {[
              'First visit: download ONNX + tokenizer from Hugging Face Hub',
              'Browser caches artifacts (Cache Storage / IndexedDB)',
              'Pipeline warms: graph loaded into ONNX Runtime',
              'Inference runs on WebGPU or WASM',
              'Later visits / offline: serve from cache when present',
              'Eviction: browser storage pressure or user clear-site-data',
            ].map((step, i) => (
              <div key={step} className="flex items-start gap-3">
                <span className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-primary/15 font-mono text-xs text-primary">
                  {i + 1}
                </span>
                <p className="text-sm text-muted-foreground">{step}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Offline behavior</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-muted-foreground">
          <p>
            After a successful cold load, subsequent inference can work without network access —
            provided the model files remain cached and the app shell itself is available (service
            worker optional; this lab relies on Hub + browser cache).
          </p>
          <p>
            Architects should treat first-load bandwidth as a product requirement and surface{' '}
            <TermTooltip term="Quantization">quantization</TermTooltip> choices explicitly.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
