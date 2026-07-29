import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea, Input, Label } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { DemoStatus } from '@/components/demo/DemoStatus'
import { PreWarmButton } from '@/components/demo/PreWarmButton'
import { usePipeline } from '@/hooks/usePipeline'
import { formatMs } from '@/lib/format'

export function QuestionAnsweringDemo() {
  const { run, loading, running, error, progress, busy, ready, preWarm } =
    usePipeline('question-answering')
  const [context, setContext] = useState(
    'Transformers.js is a JavaScript library that runs Hugging Face models in the browser using ONNX Runtime. It supports WebGPU for acceleration and WASM as a CPU fallback. Models are downloaded from the Hub and cached locally.',
  )
  const [question, setQuestion] = useState('What runtime does Transformers.js use?')
  const [answer, setAnswer] = useState<string | null>(null)
  const [score, setScore] = useState<number | null>(null)
  const [inferenceMs, setInferenceMs] = useState<number | null>(null)

  const onRun = async () => {
    const out = await run(async (pipe) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return await (pipe as any)(question, context)
    })
    if (!out) return
    setAnswer(out.result.answer)
    setScore(out.result.score)
    setInferenceMs(out.inferenceMs)
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Context</Label>
        <Textarea value={context} onChange={(e) => setContext(e.target.value)} rows={5} />
      </div>
      <div className="space-y-2">
        <Label>Question</Label>
        <Input value={question} onChange={(e) => setQuestion(e.target.value)} />
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <PreWarmButton ready={ready} busy={busy} loading={loading} onPreWarm={preWarm} />
        <Button onClick={onRun} disabled={busy || !context.trim() || !question.trim()}>
          Answer question
        </Button>
      </div>
      <DemoStatus loading={loading} running={running} progress={progress} error={error} />
      {answer && (
        <div className="space-y-2 rounded-lg border border-border bg-muted/20 p-4 animate-fade-in-up">
          <p className="text-sm text-muted-foreground">Answer</p>
          <p className="text-lg font-medium">{answer}</p>
          <div className="flex flex-wrap gap-2">
            {score != null && <Badge variant="secondary">{(score * 100).toFixed(1)}% score</Badge>}
            <span className="font-mono text-xs text-muted-foreground">{formatMs(inferenceMs)}</span>
          </div>
        </div>
      )}
    </div>
  )
}
