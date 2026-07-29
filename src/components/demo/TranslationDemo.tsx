import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea, Label } from '@/components/ui/input'
import { DemoStatus } from '@/components/demo/DemoStatus'
import { PreWarmButton } from '@/components/demo/PreWarmButton'
import { usePipeline } from '@/hooks/usePipeline'
import { formatMs } from '@/lib/format'

export function TranslationDemo() {
  const { run, loading, running, error, progress, busy, ready, preWarm } =
    usePipeline('translation')
  const [text, setText] = useState('Browser AI keeps sensitive customer data on the device.')
  const [translated, setTranslated] = useState<string | null>(null)
  const [inferenceMs, setInferenceMs] = useState<number | null>(null)

  const onRun = async () => {
    const out = await run(async (pipe) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const result = await (pipe as any)(text)
      const first = Array.isArray(result) ? result[0] : result
      return (first.translation_text ?? String(first)) as string
    })
    if (!out) return
    setTranslated(out.result)
    setInferenceMs(out.inferenceMs)
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>English input</Label>
        <Textarea value={text} onChange={(e) => setText(e.target.value)} rows={4} />
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <PreWarmButton ready={ready} busy={busy} loading={loading} onPreWarm={preWarm} />
        <Button onClick={onRun} disabled={busy || !text.trim()}>
          Translate to French
        </Button>
      </div>
      <DemoStatus loading={loading} running={running} progress={progress} error={error} />
      {translated && (
        <div className="space-y-2 rounded-lg border border-border bg-muted/20 p-4 animate-fade-in-up">
          <p className="text-sm text-muted-foreground">French output</p>
          <p className="text-base leading-relaxed">{translated}</p>
          <p className="font-mono text-xs text-muted-foreground">{formatMs(inferenceMs)}</p>
        </div>
      )}
    </div>
  )
}
