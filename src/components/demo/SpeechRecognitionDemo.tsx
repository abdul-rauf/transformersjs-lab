import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Label, Input } from '@/components/ui/input'
import { DemoStatus } from '@/components/demo/DemoStatus'
import { PreWarmButton } from '@/components/demo/PreWarmButton'
import { usePipeline } from '@/hooks/usePipeline'
import { formatMs } from '@/lib/format'

export function SpeechRecognitionDemo() {
  const { run, loading, running, error, progress, busy, ready, preWarm } =
    usePipeline('speech-recognition')
  const [file, setFile] = useState<File | null>(null)
  const [transcript, setTranscript] = useState<string | null>(null)
  const [inferenceMs, setInferenceMs] = useState<number | null>(null)

  const onRun = async () => {
    if (!file) return
    const url = URL.createObjectURL(file)
    const out = await run(async (pipe) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const result = await (pipe as any)(url)
      return (result.text ?? String(result)) as string
    })
    URL.revokeObjectURL(url)
    if (!out) return
    setTranscript(out.result)
    setInferenceMs(out.inferenceMs)
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="audio">Upload audio (wav / mp3 / ogg)</Label>
        <Input
          id="audio"
          type="file"
          accept="audio/*"
          onChange={(e) => {
            setFile(e.target.files?.[0] ?? null)
            setTranscript(null)
          }}
        />
      </div>
      {file && <p className="text-xs text-muted-foreground">{file.name}</p>}
      <div className="flex flex-wrap items-center gap-2">
        <PreWarmButton ready={ready} busy={busy} loading={loading} onPreWarm={preWarm} />
        <Button onClick={onRun} disabled={busy || !file}>
          Transcribe
        </Button>
      </div>
      <DemoStatus loading={loading} running={running} progress={progress} error={error} />
      {transcript && (
        <div className="space-y-2 rounded-lg border border-border bg-muted/20 p-4 animate-fade-in-up">
          <p className="text-sm text-muted-foreground">Transcript</p>
          <p className="text-base leading-relaxed">{transcript}</p>
          <p className="font-mono text-xs text-muted-foreground">{formatMs(inferenceMs)}</p>
        </div>
      )}
    </div>
  )
}
