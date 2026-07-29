import { useCallback, useEffect, useRef, useState } from 'react'
import { Mic, Square } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Label, Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { DemoStatus } from '@/components/demo/DemoStatus'
import { PreWarmButton } from '@/components/demo/PreWarmButton'
import { usePipeline } from '@/hooks/usePipeline'
import { formatMs } from '@/lib/format'
import { cn } from '@/lib/utils'

const canRecord =
  typeof window !== 'undefined' &&
  typeof navigator !== 'undefined' &&
  !!navigator.mediaDevices?.getUserMedia &&
  typeof MediaRecorder !== 'undefined'

function pickMimeType(): string | undefined {
  const candidates = ['audio/webm;codecs=opus', 'audio/webm', 'audio/mp4', 'audio/ogg']
  for (const type of candidates) {
    if (MediaRecorder.isTypeSupported(type)) return type
  }
  return undefined
}

function extensionForMime(mime: string): string {
  if (mime.includes('mp4')) return 'm4a'
  if (mime.includes('ogg')) return 'ogg'
  return 'webm'
}

function formatElapsed(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m}:${s.toString().padStart(2, '0')}`
}

export function SpeechRecognitionDemo() {
  const { run, loading, running, error, progress, busy, ready, preWarm } =
    usePipeline('speech-recognition')
  const [file, setFile] = useState<File | null>(null)
  const [source, setSource] = useState<'upload' | 'record' | null>(null)
  const [transcript, setTranscript] = useState<string | null>(null)
  const [inferenceMs, setInferenceMs] = useState<number | null>(null)
  const [recording, setRecording] = useState(false)
  const [elapsed, setElapsed] = useState(0)
  const [micError, setMicError] = useState<string | null>(null)

  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const timerRef = useRef<number | null>(null)

  const stopTracks = useCallback(() => {
    streamRef.current?.getTracks().forEach((t) => t.stop())
    streamRef.current = null
  }, [])

  const clearTimer = useCallback(() => {
    if (timerRef.current != null) {
      window.clearInterval(timerRef.current)
      timerRef.current = null
    }
  }, [])

  useEffect(() => {
    return () => {
      clearTimer()
      if (mediaRecorderRef.current?.state === 'recording') {
        mediaRecorderRef.current.stop()
      }
      stopTracks()
    }
  }, [clearTimer, stopTracks])

  const setAudioFile = (next: File | null, from: 'upload' | 'record' | null) => {
    setFile(next)
    setSource(from)
    setTranscript(null)
    setInferenceMs(null)
  }

  const startRecording = async () => {
    setMicError(null)
    setTranscript(null)
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      streamRef.current = stream
      const mimeType = pickMimeType()
      const recorder = mimeType
        ? new MediaRecorder(stream, { mimeType })
        : new MediaRecorder(stream)
      mediaRecorderRef.current = recorder
      chunksRef.current = []

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data)
      }

      recorder.onstop = () => {
        clearTimer()
        setRecording(false)
        const type = recorder.mimeType || mimeType || 'audio/webm'
        const blob = new Blob(chunksRef.current, { type })
        chunksRef.current = []
        stopTracks()
        if (blob.size === 0) {
          setMicError('Recording was empty. Try again.')
          return
        }
        const ext = extensionForMime(type)
        const recorded = new File([blob], `recording.${ext}`, { type })
        setAudioFile(recorded, 'record')
      }

      recorder.start(250)
      setRecording(true)
      setElapsed(0)
      timerRef.current = window.setInterval(() => {
        setElapsed((s) => s + 1)
      }, 1000)
    } catch (e) {
      stopTracks()
      const name = e instanceof DOMException ? e.name : ''
      if (name === 'NotAllowedError' || name === 'PermissionDeniedError') {
        setMicError('Microphone permission denied. Allow mic access and try again.')
      } else if (name === 'NotFoundError') {
        setMicError('No microphone found on this device.')
      } else {
        setMicError(e instanceof Error ? e.message : 'Could not start recording.')
      }
    }
  }

  const stopRecording = () => {
    const recorder = mediaRecorderRef.current
    if (recorder && recorder.state !== 'inactive') {
      recorder.stop()
    } else {
      clearTimer()
      setRecording(false)
      stopTracks()
    }
  }

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
        <Label htmlFor="audio">Upload audio (wav / mp3 / ogg / webm)</Label>
        <Input
          id="audio"
          type="file"
          accept="audio/*"
          disabled={recording || busy}
          onChange={(e) => {
            setAudioFile(e.target.files?.[0] ?? null, e.target.files?.[0] ? 'upload' : null)
          }}
        />
      </div>

      {canRecord && (
        <div className="space-y-2 rounded-lg border border-border bg-muted/15 p-3">
          <div className="flex items-center justify-between gap-2">
            <p className="text-sm font-medium">Or record from microphone</p>
            {recording && (
              <Badge variant="warning" className="gap-1.5">
                <span className="h-2 w-2 animate-pulse rounded-full bg-current" />
                Rec {formatElapsed(elapsed)}
              </Badge>
            )}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {!recording ? (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => void startRecording()}
                disabled={busy}
              >
                <Mic className="h-4 w-4" />
                Start recording
              </Button>
            ) : (
              <Button type="button" variant="destructive" size="sm" onClick={stopRecording}>
                <Square className="h-4 w-4" />
                Stop recording
              </Button>
            )}
            <p className="text-xs text-muted-foreground">
              Speak, stop, then click Transcribe. English works best with Whisper Tiny.
            </p>
          </div>
        </div>
      )}

      {!canRecord && (
        <p className="text-xs text-muted-foreground">
          Live recording is not supported in this browser. Use file upload instead.
        </p>
      )}

      {micError && (
        <p className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {micError}
        </p>
      )}

      {file && (
        <p className={cn('text-xs text-muted-foreground')}>
          Ready: <span className="font-mono text-foreground">{file.name}</span>
          {source === 'record' && ' (recorded)'}
          {source === 'upload' && ' (uploaded)'}
          {' · '}
          {(file.size / 1024).toFixed(1)} KB
        </p>
      )}

      <div className="flex flex-wrap items-center gap-2">
        <PreWarmButton ready={ready} busy={busy || recording} loading={loading} onPreWarm={preWarm} />
        <Button onClick={() => void onRun()} disabled={busy || recording || !file}>
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
