import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { TermTooltip } from '@/components/education/TermTooltip'
import { ExecutionPipeline } from '@/components/pipeline/ExecutionPipeline'

export function HowItWorksPage() {
  return (
    <div className="mx-auto max-w-4xl space-y-8 animate-fade-in-up">
      <header className="space-y-2">
        <p className="text-xs font-medium uppercase tracking-wider text-primary">Learn</p>
        <h1 className="text-3xl font-semibold tracking-tight">How Transformers.js Works</h1>
        <p className="max-w-2xl text-muted-foreground">
          From Hub download to ONNX execution — the moving parts behind every demo in this lab.
        </p>
      </header>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Animated pipeline</CardTitle>
          </CardHeader>
          <CardContent>
            <ExecutionPipeline active />
          </CardContent>
        </Card>
        <div className="space-y-4">
          {[
            {
              t: '1. Resolve model',
              d: 'pipeline(task, modelId) selects an ONNX-ready repo on Hugging Face (often Xenova/* or onnx-community/*).',
            },
            {
              t: '2. Download + cache',
              d: 'Weights and tokenizer files are fetched and stored in Cache Storage / IndexedDB for reuse.',
            },
            {
              t: '3. Tokenize',
              d: 'The Tokenizer maps text to token IDs the model was trained on.',
            },
            {
              t: '4. Execute',
              d: 'ONNX Runtime runs the graph on WebGPU (preferred) or WASM (fallback).',
            },
            {
              t: '5. Post-process',
              d: 'The pipeline converts logits/tensors into labels, text, or scores.',
            },
          ].map((s) => (
            <Card key={s.t}>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">{s.t}</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">{s.d}</CardContent>
            </Card>
          ))}
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Key technologies</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 sm:grid-cols-2">
          {(
            [
              'Transformer',
              'Token',
              'Tokenizer',
              'Attention',
              'ONNX',
              'ONNX Runtime',
              'WebGPU',
              'WASM',
              'Quantization',
              'Hugging Face',
            ] as const
          ).map((term) => (
            <div key={term} className="rounded-md border border-border px-3 py-2 text-sm">
              <TermTooltip term={term} />
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
