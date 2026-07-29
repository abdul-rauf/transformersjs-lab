import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea, Label } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { DemoStatus } from '@/components/demo/DemoStatus'
import { PreWarmButton } from '@/components/demo/PreWarmButton'
import { usePipeline } from '@/hooks/usePipeline'
import { cosineSimilarity, l2Normalize, meanPool } from '@/lib/math'
import { formatMs } from '@/lib/format'
import { TermTooltip } from '@/components/education/TermTooltip'

function toVector(output: unknown): number[] {
  // transformers.js feature-extraction may return Tensor-like or nested arrays
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const o = output as any
  const data = o?.data ?? o
  if (Array.isArray(data) && typeof data[0] === 'number') {
    return data as number[]
  }
  if (Array.isArray(data) && Array.isArray(data[0])) {
    return l2Normalize(meanPool(data as number[][]))
  }
  if (data?.tolist) {
    const listed = data.tolist()
    if (Array.isArray(listed[0])) return l2Normalize(meanPool(listed))
    return listed
  }
  // Flatten typed array
  if (o?.data && ArrayBuffer.isView(o.data)) {
    const dims = o.dims as number[] | undefined
    const flat = Array.from(o.data as ArrayLike<number>)
    if (dims && dims.length === 3) {
      // [1, seq, hidden]
      const seq = dims[1]!
      const hidden = dims[2]!
      const rows: number[][] = []
      for (let i = 0; i < seq; i++) {
        rows.push(flat.slice(i * hidden, (i + 1) * hidden))
      }
      return l2Normalize(meanPool(rows))
    }
    if (dims && dims.length === 2) {
      return l2Normalize(Array.from(flat))
    }
    return Array.from(flat)
  }
  return []
}

export function EmbeddingsDemo() {
  const { run, loading, running, error, progress, busy, ready, preWarm } =
    usePipeline('embeddings')
  const [a, setA] = useState('The customer wants a refund for the delayed shipment.')
  const [b, setB] = useState('A buyer requested money back because delivery was late.')
  const [score, setScore] = useState<number | null>(null)
  const [previewA, setPreviewA] = useState<number[]>([])
  const [previewB, setPreviewB] = useState<number[]>([])
  const [inferenceMs, setInferenceMs] = useState<number | null>(null)

  const onRun = async () => {
    const out = await run(async (pipe) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const p = pipe as any
      const ea = toVector(await p(a, { pooling: 'mean', normalize: true }))
      const eb = toVector(await p(b, { pooling: 'mean', normalize: true }))
      return { ea, eb, sim: cosineSimilarity(ea, eb) }
    })
    if (!out) return
    setScore(out.result.sim)
    setPreviewA(out.result.ea.slice(0, 12))
    setPreviewB(out.result.eb.slice(0, 12))
    setInferenceMs(out.inferenceMs)
  }

  const similar = score != null && score >= 0.7

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label>Sentence A</Label>
          <Textarea value={a} onChange={(e) => setA(e.target.value)} rows={3} />
        </div>
        <div className="space-y-2">
          <Label>Sentence B</Label>
          <Textarea value={b} onChange={(e) => setB(e.target.value)} rows={3} />
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <PreWarmButton ready={ready} busy={busy} loading={loading} onPreWarm={preWarm} />
        <Button onClick={onRun} disabled={busy || !a.trim() || !b.trim()}>
          Compute similarity
        </Button>
      </div>
      <DemoStatus loading={loading} running={running} progress={progress} error={error} />
      {score != null && (
        <div className="space-y-3 rounded-lg border border-border bg-muted/20 p-4 animate-fade-in-up">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm text-muted-foreground">
              <TermTooltip term="Cosine Similarity" /> score
            </span>
            <span className="font-mono text-lg font-semibold">{score.toFixed(4)}</span>
            <Badge variant={similar ? 'success' : 'warning'}>
              {similar ? 'Semantically similar' : 'Not strongly similar'}
            </Badge>
            <span className="font-mono text-xs text-muted-foreground">{formatMs(inferenceMs)}</span>
          </div>
          <p className="text-sm text-muted-foreground">
            Threshold ≈ 0.70. Scores near 1.0 mean the sentences point in nearly the same semantic
            direction in embedding space.
          </p>
          <div className="grid gap-3 md:grid-cols-2">
            <VectorBars label="Vector A (first 12 dims)" values={previewA} />
            <VectorBars label="Vector B (first 12 dims)" values={previewB} />
          </div>
        </div>
      )}
    </div>
  )
}

function VectorBars({ label, values }: { label: string; values: number[] }) {
  return (
    <div>
      <p className="mb-2 text-xs text-muted-foreground">{label}</p>
      <div className="flex h-16 items-end gap-1">
        {values.map((v, i) => (
          <div
            key={i}
            className="flex-1 rounded-t bg-primary/70"
            style={{ height: `${Math.min(100, Math.abs(v) * 100)}%` }}
            title={v.toFixed(3)}
          />
        ))}
      </div>
    </div>
  )
}
