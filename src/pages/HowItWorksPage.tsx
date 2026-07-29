import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { TermTooltip } from '@/components/education/TermTooltip'
import { ExecutionPipeline } from '@/components/pipeline/ExecutionPipeline'

const TASK_EXAMPLES = [
  { task: 'feature-extraction', note: 'Embeddings / similarity' },
  { task: 'summarization', note: 'Long text → short abstract' },
  { task: 'question-answering', note: 'Answer from a context span' },
  { task: 'translation', note: 'e.g. EN → FR' },
  { task: 'text-generation', note: 'Small local LLM replies' },
  { task: 'image-classification', note: 'Label an uploaded image' },
  { task: 'automatic-speech-recognition', note: 'Audio → transcript' },
] as const

function CodeSnippet() {
  return (
    <pre className="code-snippet overflow-x-auto rounded-lg border border-border p-4 font-mono text-[12px] leading-relaxed md:text-[13px]">
      <code>
        <span className="tok-kw">import</span>
        {' { '}
        <span className="tok-fn">pipeline</span>
        {' } '}
        <span className="tok-kw">from</span>{' '}
        <span className="tok-str">&apos;@huggingface/transformers&apos;</span>
        <span className="tok-punc">;</span>
        {'\n\n'}
        <span className="tok-cmt">
          {'// 1) Load a task pipeline (downloads + caches the ONNX model)'}
        </span>
        {'\n'}
        <span className="tok-kw">const</span> <span className="tok-fn">classifier</span>{' '}
        <span className="tok-punc">=</span> <span className="tok-kw">await</span>{' '}
        <span className="tok-fn">pipeline</span>
        <span className="tok-punc">(</span>
        {'\n'}
        {'  '}
        <span className="tok-str">&apos;text-classification&apos;</span>
        <span className="tok-punc">,</span>
        {'\n'}
        {'  '}
        <span className="tok-str">
          &apos;Xenova/distilbert-base-uncased-finetuned-sst-2-english&apos;
        </span>
        <span className="tok-punc">,</span>
        {'\n'}
        <span className="tok-punc">);</span>
        {'\n\n'}
        <span className="tok-cmt">{'// 2) Run inference entirely in the browser'}</span>
        {'\n'}
        <span className="tok-kw">const</span> <span className="tok-var">result</span>{' '}
        <span className="tok-punc">=</span> <span className="tok-kw">await</span>{' '}
        <span className="tok-fn">classifier</span>
        <span className="tok-punc">(</span>
        <span className="tok-str">&apos;Browser AI keeps data on-device.&apos;</span>
        <span className="tok-punc">);</span>
        {'\n'}
        <span className="tok-cmt">
          {"// → [{ label: 'POSITIVE', score: 0.99 }]"}
        </span>
      </code>
    </pre>
  )
}

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
          <CardTitle>Minimal code to use a capability</CardTitle>
          <CardDescription>
            Same <TermTooltip term="Pipeline">pipeline()</TermTooltip> API as Python transformers —
            load once, then call with your input. Runs via <TermTooltip term="ONNX Runtime" /> in the
            browser.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <CodeSnippet />
          <div>
            <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Swap the task string for other capabilities
            </p>
            <ul className="grid gap-2 sm:grid-cols-2">
              {TASK_EXAMPLES.map((row) => (
                <li
                  key={row.task}
                  className="rounded-md border border-border bg-muted/20 px-3 py-2 font-mono text-xs"
                >
                  <span className="text-primary">{`'${row.task}'`}</span>
                  <span className="mt-0.5 block font-sans text-[11px] text-muted-foreground">
                    {row.note}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>

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
