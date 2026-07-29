import { Flame, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

interface PreWarmButtonProps {
  ready: boolean
  busy: boolean
  loading: boolean
  onPreWarm: () => void
}

export function PreWarmButton({ ready, busy, loading, onPreWarm }: PreWarmButtonProps) {
  if (ready && !loading) {
    return (
      <Badge variant="success" className="gap-1.5 px-3 py-1.5">
        <CheckCircle2 className="h-3.5 w-3.5" />
        Model ready
      </Badge>
    )
  }

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      onClick={onPreWarm}
      disabled={busy}
      title="Download and load the model before running inference"
    >
      <Flame className="h-4 w-4" />
      {loading ? 'Warming up…' : 'Pre-warm model'}
    </Button>
  )
}
