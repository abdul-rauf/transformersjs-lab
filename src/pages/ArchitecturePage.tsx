import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { TermTooltip } from '@/components/education/TermTooltip'

export function ArchitecturePage() {
  return (
    <div className="mx-auto max-w-4xl space-y-8 animate-fade-in-up">
      <header className="space-y-2">
        <p className="text-xs font-medium uppercase tracking-wider text-primary">Systems</p>
        <h1 className="text-3xl font-semibold tracking-tight">Architecture</h1>
        <p className="max-w-2xl text-muted-foreground">
          Side-by-side mental models for traditional cloud AI vs in-browser Transformers.js.
        </p>
      </header>

      <div className="grid gap-6 md:grid-cols-2">
        <ArchStack
          title="Traditional AI"
          subtitle="Request leaves the browser"
          steps={[
            { name: 'Browser', desc: 'UI collects input and awaits JSON.' },
            { name: 'Backend / API', desc: 'Auth, rate limits, orchestration.' },
            { name: 'Python / ML service', desc: 'transformers, vLLM, custom servers.' },
            { name: 'LLM / Model', desc: 'Large GPU-hosted weights.' },
          ]}
        />
        <ArchStack
          title="Browser AI"
          subtitle="Inference stays on-device"
          accent
          steps={[
            { name: 'Browser', desc: 'SPA hosts UI + model runtime.' },
            { name: 'Transformers.js', desc: 'Pipelines, tokenizers, Hub fetch.' },
            { name: 'ONNX Runtime', desc: 'WebGPU or WASM execution.' },
            { name: 'Model (ONNX)', desc: 'Quantized weights in cache.' },
          ]}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Component glossary</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 sm:grid-cols-2 text-sm text-muted-foreground">
          <p>
            <TermTooltip term="Hugging Face" /> hosts model cards and ONNX artifacts consumed by the
            browser.
          </p>
          <p>
            <TermTooltip term="ONNX Runtime" /> is the execution engine — the same family used
            server-side, compiled to the web.
          </p>
          <p>
            <TermTooltip term="WebGPU" /> provides GPU compute when the browser and drivers allow.
          </p>
          <p>
            <TermTooltip term="WASM" /> is the portable CPU fallback for nearly all modern browsers.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

function ArchStack({
  title,
  subtitle,
  steps,
  accent,
}: {
  title: string
  subtitle: string
  accent?: boolean
  steps: { name: string; desc: string }[]
}) {
  return (
    <Card className={accent ? 'border-primary/40' : undefined}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{subtitle}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {steps.map((s, i) => (
          <div key={s.name}>
            <div
              className={`rounded-lg border px-4 py-3 ${
                accent ? 'border-primary/30 bg-primary/5' : 'border-border bg-muted/20'
              }`}
            >
              <p className="font-medium">{s.name}</p>
              <p className="mt-1 text-xs text-muted-foreground">{s.desc}</p>
            </div>
            {i < steps.length - 1 && (
              <div className="flex justify-center py-1 text-primary animate-flow-down">↓</div>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
