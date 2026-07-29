import { useMemo, useState } from 'react'
import { DECISION_MATRIX, type Recommendation } from '@/content/decisionMatrix'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'

const FILTERS: { id: Recommendation | 'all'; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'browser', label: 'Browser AI' },
  { id: 'cloud', label: 'Cloud AI' },
  { id: 'both', label: 'Both' },
]

export function DecisionMatrixPage() {
  const [filter, setFilter] = useState<Recommendation | 'all'>('all')

  const rows = useMemo(
    () =>
      filter === 'all'
        ? DECISION_MATRIX
        : DECISION_MATRIX.filter((r) => r.recommendation === filter),
    [filter],
  )

  return (
    <div className="mx-auto max-w-4xl space-y-8 animate-fade-in-up">
      <header className="space-y-2">
        <p className="text-xs font-medium uppercase tracking-wider text-primary">Strategy</p>
        <h1 className="text-3xl font-semibold tracking-tight">Decision Matrix</h1>
        <p className="max-w-2xl text-muted-foreground">
          Should you use Browser AI, Cloud AI, or both? Filter by recommendation.
        </p>
      </header>

      <div className="flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <Button
            key={f.id}
            size="sm"
            variant={filter === f.id ? 'default' : 'outline'}
            onClick={() => setFilter(f.id)}
          >
            {f.label}
          </Button>
        ))}
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <Stat
          title="Should I use Browser AI?"
          body="Yes for privacy, offline, and small deterministic tasks (classify, embed, light ASR)."
        />
        <Stat
          title="Should I use Cloud AI?"
          body="Yes for frontier reasoning, coding assistants, and long-document workflows."
        />
        <Stat
          title="Should I use both?"
          body="Often — browser for triage/retrieval, cloud for generation and hard reasoning."
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recommendations</CardTitle>
          <CardDescription>{rows.length} use cases shown</CardDescription>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <table className="w-full min-w-[36rem] text-left text-sm">
            <thead className="text-xs uppercase tracking-wide text-muted-foreground">
              <tr className="border-b border-border">
                <th className="pb-3 pr-4">Use case</th>
                <th className="pb-3 pr-4">Recommendation</th>
                <th className="pb-3">Rationale</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.useCase} className="border-b border-border/70 align-top">
                  <td className="py-3 pr-4 font-medium">{row.useCase}</td>
                  <td className="py-3 pr-4">
                    <RecBadge value={row.recommendation} />
                  </td>
                  <td className="py-3 text-muted-foreground">{row.rationale}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  )
}

function Stat({ title, body }: { title: string; body: string }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{title}</CardTitle>
        <CardDescription>{body}</CardDescription>
      </CardHeader>
    </Card>
  )
}

function RecBadge({ value }: { value: Recommendation }) {
  return (
    <Badge
      className={cn(
        value === 'browser' && 'bg-teal-600/15 text-teal-700 dark:text-teal-300',
        value === 'cloud' && 'bg-sky-600/15 text-sky-700 dark:text-sky-300',
        value === 'both' && 'bg-amber-600/15 text-amber-700 dark:text-amber-300',
      )}
      variant="secondary"
    >
      {value === 'browser' ? 'Browser AI' : value === 'cloud' ? 'Cloud AI' : 'Both'}
    </Badge>
  )
}
