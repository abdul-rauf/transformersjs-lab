import { useEffect, useState, type ReactNode } from 'react'
import { getModel } from '@/ai/registry'
import { emptyMetric, getMetric } from '@/ai/metricsStore'
import { getSelectedModelId, MODEL_SELECTION_EVENT } from '@/ai/modelSelection'
import { CAPABILITY_CONTENT } from '@/content/capabilities'
import type { PerformanceMetrics, TaskId } from '@/types'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ExecutionPipeline } from '@/components/pipeline/ExecutionPipeline'
import { TermTooltip } from '@/components/education/TermTooltip'
import { ModelSelector } from '@/components/demo/ModelSelector'
import { formatMs } from '@/lib/format'

interface CapabilityPageProps {
  taskId: TaskId
  demo: ReactNode
}

export function CapabilityPage({ taskId, demo }: CapabilityPageProps) {
  const content = CAPABILITY_CONTENT[taskId]!
  const defaults = getModel(taskId)
  const [selectedModelId, setSelectedModelIdState] = useState(() => getSelectedModelId(taskId))
  const [metrics, setMetrics] = useState<PerformanceMetrics>(
    () => getMetric(taskId) ?? emptyMetric(taskId),
  )
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    const refreshMetrics = () => setMetrics(getMetric(taskId) ?? emptyMetric(taskId))
    const refreshModel = () => setSelectedModelIdState(getSelectedModelId(taskId))
    const onBusy = (e: Event) => {
      const detail = (e as CustomEvent<{ taskId: TaskId; busy: boolean }>).detail
      if (detail?.taskId === taskId) setBusy(detail.busy)
    }
    window.addEventListener('browser-ai-metrics', refreshMetrics)
    window.addEventListener('browser-ai-busy', onBusy)
    window.addEventListener(MODEL_SELECTION_EVENT, refreshModel)
    refreshModel()
    return () => {
      window.removeEventListener('browser-ai-metrics', refreshMetrics)
      window.removeEventListener('browser-ai-busy', onBusy)
      window.removeEventListener(MODEL_SELECTION_EVENT, refreshModel)
    }
  }, [taskId])

  const isDefault = selectedModelId === defaults.modelId

  return (
    <div className="mx-auto max-w-6xl space-y-10 animate-fade-in-up">
      <header className="space-y-2">
        <p className="text-xs font-medium uppercase tracking-wider text-primary">Capability</p>
        <h1 className="text-3xl font-semibold tracking-tight">{content.title}</h1>
      </header>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">1. Overview</h2>
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>What is it?</CardTitle>
            </CardHeader>
            <CardContent className="text-sm leading-relaxed text-muted-foreground">
              {content.overview.what}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Why use it?</CardTitle>
            </CardHeader>
            <CardContent className="text-sm leading-relaxed text-muted-foreground">
              {content.overview.why}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>How it works</CardTitle>
            </CardHeader>
            <CardContent className="text-sm leading-relaxed text-muted-foreground">
              {content.overview.how}
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">2. Interactive Playground</h2>
        <div className="grid items-start gap-4 lg:grid-cols-[minmax(0,1.4fr)_minmax(18rem,0.9fr)]">
          <Card className="min-w-0">
            <CardHeader>
              <CardTitle>Try it locally</CardTitle>
              <CardDescription>
                Runs entirely in your browser via{' '}
                <TermTooltip term="Pipeline">pipeline</TermTooltip> +{' '}
                <TermTooltip term="ONNX Runtime" />. Use{' '}
                <span className="font-medium text-foreground">Pre-warm model</span> before presenting
                to avoid a cold download mid-demo.
              </CardDescription>
            </CardHeader>
            <CardContent>{demo}</CardContent>
          </Card>

          <aside className="space-y-4 lg:sticky lg:top-20">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Model selector</CardTitle>
                <CardDescription>Switch among Hub models for this task</CardDescription>
              </CardHeader>
              <CardContent>
                <ModelSelector taskId={taskId} disabled={busy} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Model Information</CardTitle>
                <CardDescription>Currently selected model</CardDescription>
              </CardHeader>
              <CardContent>
                <dl className="space-y-2">
                  {[
                    ['Display name', isDefault ? defaults.displayName : selectedModelId.split('/').pop()],
                    ['Hugging Face Model', selectedModelId],
                    ['Task', defaults.task],
                    ...(isDefault
                      ? [
                          ['Download Size', `~${defaults.downloadSizeMB} MB`],
                          ['Approx. Memory', `~${defaults.memoryMB} MB`],
                        ]
                      : [
                          ['Download Size', 'Varies (see Hub card)'],
                          ['Approx. Memory', 'Depends on dtype / device'],
                        ]),
                    ['Input', defaults.inputType],
                    ['Output', defaults.outputType],
                  ].map(([k, v]) => (
                    <div
                      key={k}
                      className="rounded-md border border-border bg-muted/30 px-3 py-2"
                    >
                      <dt className="text-[11px] uppercase tracking-wide text-muted-foreground">
                        {k}
                      </dt>
                      <dd className="mt-0.5 break-all font-mono text-xs leading-snug">{v}</dd>
                    </div>
                  ))}
                </dl>
                <a
                  href={`https://huggingface.co/${selectedModelId}`}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-3 inline-block text-sm text-primary hover:underline"
                >
                  View on Hugging Face →
                </a>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Performance Metrics</CardTitle>
                <CardDescription>Live timings from this session</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    ['First load', formatMs(metrics.coldLoadMs)],
                    ['Warm load', formatMs(metrics.warmLoadMs)],
                    ['Inference', formatMs(metrics.inferenceMs)],
                    ['Backend', metrics.device.toUpperCase()],
                  ].map(([label, value]) => (
                    <div
                      key={label}
                      className="rounded-md border border-border bg-muted/20 px-3 py-2"
                    >
                      <p className="text-[11px] text-muted-foreground">{label}</p>
                      <p className="mt-0.5 font-mono text-sm font-semibold">{value}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </aside>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">3. Execution Pipeline</h2>
        <Card>
          <CardContent className="pt-5">
            <ExecutionPipeline active={busy} />
          </CardContent>
        </Card>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">4. Enterprise Use Cases</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {content.enterpriseUseCases.map((uc) => (
            <Card key={uc.title}>
              <CardHeader>
                <Badge variant="secondary" className="w-fit">
                  {uc.title}
                </Badge>
                <CardDescription className="pt-2">{uc.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">5. Limitations</h2>
        <Card>
          <CardContent className="pt-5">
            <ul className="list-disc space-y-2 pl-5 text-sm text-muted-foreground">
              {content.limitations.map((l) => (
                <li key={l}>{l}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </section>
    </div>
  )
}
