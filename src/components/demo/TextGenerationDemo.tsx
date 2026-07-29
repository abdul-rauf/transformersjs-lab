import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea, Label } from '@/components/ui/input'
import { DemoStatus } from '@/components/demo/DemoStatus'
import { PreWarmButton } from '@/components/demo/PreWarmButton'
import { usePipeline } from '@/hooks/usePipeline'
import { formatMs } from '@/lib/format'

export function TextGenerationDemo() {
  const { run, loading, running, error, progress, busy, ready, preWarm } =
    usePipeline('text-generation')
  const [prompt, setPrompt] = useState(
    'Explain in two sentences why Browser AI is useful for privacy-sensitive CRM workflows.',
  )
  const [output, setOutput] = useState<string | null>(null)
  const [inferenceMs, setInferenceMs] = useState<number | null>(null)

  const onRun = async () => {
    const out = await run(async (pipe) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const result = await (pipe as any)(prompt, {
        max_new_tokens: 80,
        temperature: 0.7,
        do_sample: true,
      })
      const first = Array.isArray(result) ? result[0] : result
      return (first.generated_text ?? String(first)) as string
    })
    if (!out) return
    setOutput(out.result)
    setInferenceMs(out.inferenceMs)
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Prompt</Label>
        <Textarea value={prompt} onChange={(e) => setPrompt(e.target.value)} rows={4} />
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <PreWarmButton ready={ready} busy={busy} loading={loading} onPreWarm={preWarm} />
        <Button onClick={onRun} disabled={busy || !prompt.trim()}>
          Generate
        </Button>
      </div>
      <DemoStatus loading={loading} running={running} progress={progress} error={error} />
      {output && (
        <div className="space-y-2 rounded-lg border border-border bg-muted/20 p-4 animate-fade-in-up">
          <p className="text-sm text-muted-foreground">Generated response</p>
          <p className="whitespace-pre-wrap text-sm leading-relaxed">{output}</p>
          <p className="font-mono text-xs text-muted-foreground">
            Generation time: {formatMs(inferenceMs)}
          </p>
        </div>
      )}
    </div>
  )
}
