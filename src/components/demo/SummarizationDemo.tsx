import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea, Label } from '@/components/ui/input'
import { DemoStatus } from '@/components/demo/DemoStatus'
import { PreWarmButton } from '@/components/demo/PreWarmButton'
import { usePipeline } from '@/hooks/usePipeline'
import { formatMs, wordCount } from '@/lib/format'

const SAMPLE = `Browser AI enables software architects to run machine learning models directly inside the user's web browser. Instead of sending sensitive data to a remote GPU cluster, inference happens on-device using Transformers.js and ONNX Runtime. This approach improves privacy, reduces recurring API costs, and unlocks offline experiences. The trade-off is that models must stay small enough for download and memory constraints, and quality will not match the largest cloud LLMs. For classification, embeddings, and lightweight summarization, Browser AI is often the right enterprise default.`

export function SummarizationDemo() {
  const { run, loading, running, error, progress, busy, ready, preWarm } =
    usePipeline('summarization')
  const [text, setText] = useState(SAMPLE)
  const [summary, setSummary] = useState<string | null>(null)
  const [inferenceMs, setInferenceMs] = useState<number | null>(null)

  const onRun = async () => {
    const out = await run(async (pipe) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const result = await (pipe as any)(text, { max_new_tokens: 80 })
      const first = Array.isArray(result) ? result[0] : result
      return (first.summary_text ?? first.generated_text ?? String(first)) as string
    })
    if (!out) return
    setSummary(out.result)
    setInferenceMs(out.inferenceMs)
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Long paragraph</Label>
        <Textarea value={text} onChange={(e) => setText(e.target.value)} rows={8} />
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <PreWarmButton ready={ready} busy={busy} loading={loading} onPreWarm={preWarm} />
        <Button onClick={onRun} disabled={busy || !text.trim()}>
          Summarize
        </Button>
      </div>
      <DemoStatus loading={loading} running={running} progress={progress} error={error} />
      {summary && (
        <div className="space-y-2 rounded-lg border border-border bg-muted/20 p-4 animate-fade-in-up">
          <p className="text-sm font-medium">Summary</p>
          <p className="text-sm leading-relaxed">{summary}</p>
          <div className="flex flex-wrap gap-4 font-mono text-xs text-muted-foreground">
            <span>
              Original: {text.length} chars / {wordCount(text)} words
            </span>
            <span>
              Summary: {summary.length} chars / {wordCount(summary)} words
            </span>
            <span>{formatMs(inferenceMs)}</span>
          </div>
        </div>
      )}
    </div>
  )
}
