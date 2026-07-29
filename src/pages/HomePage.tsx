import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { TermTooltip } from '@/components/education/TermTooltip'
import { ExecutionPipeline } from '@/components/pipeline/ExecutionPipeline'

export function HomePage() {
  return (
    <div className="mx-auto max-w-4xl space-y-12 animate-fade-in-up">
      <section className="relative overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-slate-900 via-slate-800 to-teal-950 px-6 py-12 text-slate-50 md:px-10">
        <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-teal-500/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 left-10 h-48 w-48 rounded-full bg-cyan-400/10 blur-3xl" />
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-teal-300">
          Browser AI Technology Explorer
        </p>
        <h1 className="mt-3 max-w-2xl text-3xl font-semibold tracking-tight md:text-4xl">
          Run production ML in the browser — privately, offline-capable, without Python.
        </h1>
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-slate-300 md:text-base">
          An educational playground for software architects and senior engineers covering{' '}
          <TermTooltip term="Hugging Face">Hugging Face</TermTooltip>,{' '}
          <TermTooltip term="Transformer">Transformers.js</TermTooltip>, and{' '}
          <TermTooltip term="ONNX Runtime" />.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Button asChild>
            <Link to="/text-classification">
              Open a live demo <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
          <Button asChild variant="secondary">
            <Link to="/architecture">View architecture</Link>
          </Button>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>What is Browser AI?</CardTitle>
            <CardDescription>Inference at the edge of the web platform</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm leading-relaxed text-muted-foreground">
            <p>
              Browser AI means shipping neural models as web assets and executing{' '}
              <TermTooltip term="Inference">inference</TermTooltip> inside the user’s browser — no
              dedicated ML backend required for the hot path.
            </p>
            <p>
              Ideal for privacy-sensitive classification, embeddings, lightweight summarization, and
              offline experiences.
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>What is Transformers.js?</CardTitle>
            <CardDescription>JS twin of the Python transformers API</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm leading-relaxed text-muted-foreground">
            <p>
              Transformers.js loads <TermTooltip term="ONNX" /> models from the Hub, tokenizes
              inputs, and runs them via ONNX Runtime (WebGPU or WASM).
            </p>
            <p>
              The <TermTooltip term="Pipeline">pipeline()</TermTooltip> API mirrors Python, so
              frontend teams can adopt familiar task abstractions.
            </p>
          </CardContent>
        </Card>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Why does it exist?</h2>
        <div className="grid gap-3 sm:grid-cols-3">
          {[
            ['Privacy', 'Keep PII and proprietary text on-device.'],
            ['Cost', 'Avoid per-token cloud bills for high-volume small tasks.'],
            ['Offline', 'Cached models keep apps useful on planes and air-gapped networks.'],
          ].map(([t, d]) => (
            <Card key={t}>
              <CardHeader>
                <CardTitle className="text-base">{t}</CardTitle>
                <CardDescription>{d}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Browser AI vs Cloud AI</h2>
        <div className="overflow-x-auto rounded-lg border border-border">
          <table className="w-full min-w-[32rem] text-left text-sm">
            <thead className="bg-muted/50 text-xs uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="px-4 py-3">Dimension</th>
                <th className="px-4 py-3">Browser AI</th>
                <th className="px-4 py-3">Cloud AI</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['Data residency', 'Stays on device', 'Sent to provider'],
                ['Model size', 'Small / quantized', 'Frontier LLMs'],
                ['Latency (warm)', 'Local, low jitter', 'Network + queue'],
                ['Cold start', 'Download + compile', 'Usually warm'],
                ['Best for', 'Classify, embed, ASR-light', 'Reasoning, coding, long chat'],
              ].map(([d, b, c]) => (
                <tr key={d} className="border-t border-border">
                  <td className="px-4 py-3 font-medium">{d}</td>
                  <td className="px-4 py-3 text-muted-foreground">{b}</td>
                  <td className="px-4 py-3 text-muted-foreground">{c}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="grid gap-6 md:grid-cols-2">
        <div>
          <h2 className="mb-4 text-xl font-semibold">Typical execution flow</h2>
          <ExecutionPipeline active />
        </div>
        <Card className="self-start">
          <CardHeader>
            <CardTitle>Start exploring</CardTitle>
            <CardDescription>Follow the sidebar like a product docs site.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            <Button asChild variant="outline">
              <Link to="/browser-ai">Browser AI deep dive</Link>
            </Button>
            <Button asChild variant="outline">
              <Link to="/how-it-works">How Transformers.js works</Link>
            </Button>
            <Button asChild variant="outline">
              <Link to="/decision-matrix">Decision matrix</Link>
            </Button>
          </CardContent>
        </Card>
      </section>
    </div>
  )
}
