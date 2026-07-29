# Browser AI Technology Explorer

Educational playground for software architects and senior engineers exploring **Browser AI**, **Transformers.js**, **Hugging Face**, and **ONNX Runtime** — entirely in the browser.

No backend. No Python. No Ollama.

## Quick start

```bash
npm install
npm run dev
```

Open the printed local URL (typically `http://localhost:5173`).

```bash
npm run build    # production build
npm run preview  # preview production build
```

## Deploy to Vercel

This app is a static Vite SPA (no server). Deployment config lives in [`vercel.json`](vercel.json) (SPA rewrites + COOP/COEP headers).

### Dashboard

1. Push this repo to GitHub.
2. In [Vercel](https://vercel.com) → **Add New Project** → import the repo.
3. Confirm settings (usually auto-detected from `vercel.json` / Vite):
   - **Framework:** Vite
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
4. Click **Deploy**.

### CLI

```bash
npm i -g vercel
vercel login
vercel          # preview deployment
vercel --prod   # production
```

After deploy, verify deep links (e.g. `/embeddings`) still work on refresh, then run one demo (Pre-warm → Run). Models download from Hugging Face in the browser at runtime.

## Architecture

```
Browser
  └── React + Vite SPA
        ├── UI (layout, capability pages, diagrams)
        ├── Hooks (usePipeline, device capability, metrics)
        └── AI layer
              ├── registry.ts     # task → model metadata
              ├── pipelines/      # load + cache Transformers.js pipelines
              └── metricsStore    # session performance measurements
                    └── @huggingface/transformers
                          └── ONNX Runtime (WebGPU | WASM)
                                └── Hub ONNX models (cached)
```

## Folder structure

```
src/
  app/                 # providers + router
  pages/               # one page per sidebar route
  components/
    layout/            # AppShell, Sidebar, Header
    capability/        # shared 7-section CapabilityPage
    pipeline/          # animated execution pipeline
    demo/              # interactive demos per task
    education/         # TermTooltip, ExplainPageButton
    ui/                # shadcn-style primitives
  ai/
    registry.ts        # model catalog
    pipelines/loader.ts
    cache.ts
    metricsStore.ts
  hooks/               # usePipeline, usePerformance, device detection
  lib/                 # math, format, cn
  content/             # copy: glossary, enterprise, decision matrix
  types/
```

## How models are loaded

1. A demo calls `usePipeline(taskId).run(...)`.
2. `loadPipeline` in `src/ai/pipelines/loader.ts` dynamically imports `@huggingface/transformers`.
3. It prefers **WebGPU**, falls back to **WASM** (`dtype: 'q8'`).
4. `pipeline(task, modelId, options)` downloads ONNX + tokenizer files from the Hub.
5. Pipelines are cached in a module-level `Map` so warm loads skip re-download/re-init.
6. Progress callbacks drive the download UI (`DemoStatus`).

Model IDs and sizes live in [`src/ai/registry.ts`](src/ai/registry.ts).

## How performance is measured

`measureAsync` in `src/lib/format.ts` wraps load and inference with `performance.now()`.

Metrics persisted per task in `sessionStorage` (`src/ai/metricsStore.ts`):

- `coldLoadMs` — first load in this session
- `warmLoadMs` — subsequent ensure-loaded calls
- `inferenceMs` — last run duration
- `device` — `webgpu` | `wasm`

The **Performance Explorer** page charts registry estimates and live session timings.

## How to add a new AI task

1. Add a `TaskId` + entry in `src/ai/registry.ts`.
2. Add educational copy in `src/content/capabilities.ts` and a sidebar route in `src/content/navigation.ts`.
3. Create `src/components/demo/YourDemo.tsx` using `usePipeline('your-task')`.
4. Create `src/pages/YourPage.tsx` wrapping `<CapabilityPage taskId="..." demo={<YourDemo />} />`.
5. Lazy-load the page in `src/app/router.tsx`.

## Features

- 8 interactive capability demos (classification → speech)
- Shared capability layout (overview, demo, pipeline, model info, metrics, use cases, limits)
- Educational pages: Browser AI, How it works, Architecture, Storage, Enterprise, Decision Matrix
- Glossary tooltips, theme toggle, presentation mode, “Explain this page”
- WebGPU / WASM capability detection

## Notes

- First model download can be large; subsequent visits benefit from browser caching.
- COOP/COEP headers are set in `vite.config.ts` for cross-origin isolation (helpful for WASM threads / WebGPU).
- Text generation uses a small instruct model — quality is intentionally limited for browser demos.
