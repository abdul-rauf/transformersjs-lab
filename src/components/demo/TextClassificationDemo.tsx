import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea, Label } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { DemoStatus } from '@/components/demo/DemoStatus'
import { PreWarmButton } from '@/components/demo/PreWarmButton'
import { usePipeline } from '@/hooks/usePipeline'
import { formatMs } from '@/lib/format'

export function TextClassificationDemo() {
  const { run, loading, running, error, progress, busy, ready, preWarm } =
    usePipeline('text-classification')
  const [text, setText] = useState(
    'The new onboarding flow is fantastic — our customers love how fast it feels.',
  )
  const [label, setLabel] = useState<string | null>(null)
  const [score, setScore] = useState<number | null>(null)
  const [inferenceMs, setInferenceMs] = useState<number | null>(null)

  const onRun = async () => {
    const out = await run(async (pipe) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const result = await (pipe as any)(text)
      return Array.isArray(result) ? result[0] : result
    })
    if (!out) return
    setLabel(out.result.label)
    setScore(out.result.score)
    setInferenceMs(out.inferenceMs)
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="clf-input">Input text</Label>
        <Textarea id="clf-input" value={text} onChange={(e) => setText(e.target.value)} rows={4} />
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <PreWarmButton ready={ready} busy={busy} loading={loading} onPreWarm={preWarm} />
        <Button onClick={onRun} disabled={busy || !text.trim()}>
          Run classification
        </Button>
      </div>
      <DemoStatus loading={loading} running={running} progress={progress} error={error} />
      {label && score != null && (
        <div className="space-y-3 rounded-lg border border-border bg-muted/20 p-4 animate-fade-in-up">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm text-muted-foreground">Result</span>
            <Badge variant={label.toLowerCase().includes('pos') ? 'success' : 'warning'}>
              {label}
            </Badge>
            <span className="font-mono text-sm">{(score * 100).toFixed(1)}% confidence</span>
            <span className="font-mono text-xs text-muted-foreground">{formatMs(inferenceMs)}</span>
          </div>
          <Progress value={score * 100} />
          <div>
            <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Suggested CRM use cases
            </p>
            <div className="flex flex-wrap gap-2">
              {['Lead sentiment scoring', 'Churn risk triage', 'CSAT comment tagging'].map((c) => (
                <Badge key={c} variant="outline">
                  {c}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
