import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { TermTooltip } from '@/components/education/TermTooltip'

export function BrowserAIPage() {
  return (
    <div className="mx-auto max-w-4xl space-y-8 animate-fade-in-up">
      <header className="space-y-2">
        <p className="text-xs font-medium uppercase tracking-wider text-primary">Learn</p>
        <h1 className="text-3xl font-semibold tracking-tight">Browser AI</h1>
        <p className="max-w-2xl text-muted-foreground">
          A practical definition for architects evaluating on-device inference in web applications.
        </p>
      </header>

      <Card>
        <CardHeader>
          <CardTitle>Definition</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm leading-relaxed text-muted-foreground">
          <p>
            Browser AI is the practice of downloading (or bundling) neural network weights and
            executing <TermTooltip term="Inference">inference</TermTooltip> with browser compute
            APIs — primarily <TermTooltip term="WebGPU" /> and <TermTooltip term="WASM" /> — rather
            than calling a remote model endpoint for every request.
          </p>
          <p>
            Transformers.js is the most accessible path today because it reuses the Hugging Face
            model ecosystem and a Python-familiar pipeline API.
          </p>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        {[
          {
            t: 'Strengths',
            items: [
              'Privacy & data residency by design',
              'Predictable marginal cost (compute is the user’s)',
              'Offline / air-gapped capable after cache',
              'Low latency after warm load',
            ],
          },
          {
            t: 'Constraints',
            items: [
              'Model size vs download & memory budget',
              'Heterogeneous client hardware',
              'Weaker quality vs frontier cloud LLMs',
              'Cold-start UX must be designed carefully',
            ],
          },
        ].map((col) => (
          <Card key={col.t}>
            <CardHeader>
              <CardTitle>{col.t}</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc space-y-2 pl-5 text-sm text-muted-foreground">
                {col.items.map((i) => (
                  <li key={i}>{i}</li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Where it fits in an enterprise stack</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm text-muted-foreground">
          <FlowRow
            steps={['User Browser', 'Transformers.js', 'ONNX Runtime', 'Cached Model']}
            label="Browser AI path"
          />
          <FlowRow
            steps={['User Browser', 'API Gateway', 'GPU Service', 'Frontier LLM']}
            label="Cloud AI path"
          />
          <p>
            Many production systems use <strong className="text-foreground">both</strong>: browser
            models for triage/embeddings, cloud models for hard reasoning.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

function FlowRow({ steps, label }: { steps: string[]; label: string }) {
  return (
    <div>
      <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {label}
      </p>
      <div className="flex flex-wrap items-center gap-2">
        {steps.map((s, i) => (
          <div key={s} className="flex items-center gap-2">
            <span className="rounded-md border border-border bg-card px-3 py-1.5 text-xs font-medium text-foreground">
              {s}
            </span>
            {i < steps.length - 1 && <span className="text-primary">→</span>}
          </div>
        ))}
      </div>
    </div>
  )
}
