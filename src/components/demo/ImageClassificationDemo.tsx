import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Label, Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { DemoStatus } from '@/components/demo/DemoStatus'
import { PreWarmButton } from '@/components/demo/PreWarmButton'
import { usePipeline } from '@/hooks/usePipeline'
import { formatMs } from '@/lib/format'

interface Prediction {
  label: string
  score: number
}

export function ImageClassificationDemo() {
  const { run, loading, running, error, progress, busy, ready, preWarm } =
    usePipeline('image-classification')
  const [preview, setPreview] = useState<string | null>(null)
  const [file, setFile] = useState<File | null>(null)
  const [preds, setPreds] = useState<Prediction[]>([])
  const [inferenceMs, setInferenceMs] = useState<number | null>(null)

  const onFile = (f: File | null) => {
    setFile(f)
    setPreds([])
    if (preview) URL.revokeObjectURL(preview)
    setPreview(f ? URL.createObjectURL(f) : null)
  }

  const onRun = async () => {
    if (!file) return
    const url = URL.createObjectURL(file)
    const out = await run(async (pipe) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const result = await (pipe as any)(url)
      return (Array.isArray(result) ? result : [result]) as Prediction[]
    })
    URL.revokeObjectURL(url)
    if (!out) return
    setPreds(out.result.slice(0, 5))
    setInferenceMs(out.inferenceMs)
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="img">Upload image</Label>
        <Input
          id="img"
          type="file"
          accept="image/*"
          onChange={(e) => onFile(e.target.files?.[0] ?? null)}
        />
      </div>
      {preview && (
        <img
          src={preview}
          alt="Preview"
          className="max-h-56 rounded-lg border border-border object-contain"
        />
      )}
      <div className="flex flex-wrap items-center gap-2">
        <PreWarmButton ready={ready} busy={busy} loading={loading} onPreWarm={preWarm} />
        <Button onClick={onRun} disabled={busy || !file}>
          Classify image
        </Button>
      </div>
      <DemoStatus loading={loading} running={running} progress={progress} error={error} />
      {preds.length > 0 && (
        <div className="space-y-3 rounded-lg border border-border bg-muted/20 p-4 animate-fade-in-up">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Top predictions</span>
            <span className="font-mono text-xs text-muted-foreground">{formatMs(inferenceMs)}</span>
          </div>
          {preds.map((p) => (
            <div key={p.label} className="space-y-1">
              <div className="flex items-center justify-between gap-2">
                <Badge variant="outline">{p.label}</Badge>
                <span className="font-mono text-xs">{(p.score * 100).toFixed(1)}%</span>
              </div>
              <Progress value={p.score * 100} />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
