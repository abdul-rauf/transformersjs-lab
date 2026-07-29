import { Loader2 } from 'lucide-react'
import { Progress } from '@/components/ui/progress'
import type { ProgressStatus } from '@/types'

export function DemoStatus({
  loading,
  running,
  progress,
  error,
}: {
  loading: boolean
  running: boolean
  progress: ProgressStatus | null
  error: string | null
}) {
  const pct =
    progress?.progress != null
      ? Math.round(progress.progress)
      : progress?.loaded && progress?.total
        ? Math.round((progress.loaded / progress.total) * 100)
        : undefined

  return (
    <div className="space-y-2">
      {(loading || running) && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin text-primary" />
          <span>
            {loading
              ? progress?.status || 'Loading model…'
              : 'Running inference…'}
            {progress?.file ? ` (${progress.file})` : ''}
          </span>
        </div>
      )}
      {loading && pct != null && (
        <div className="space-y-1">
          <Progress value={pct} />
          <p className="font-mono text-xs text-muted-foreground">{pct}%</p>
        </div>
      )}
      {loading && pct == null && <div className="h-2 w-full overflow-hidden rounded-full bg-muted animate-shimmer" />}
      {error && (
        <p className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {error}
        </p>
      )}
    </div>
  )
}
