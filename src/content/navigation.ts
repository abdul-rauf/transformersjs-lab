import type { NavItem } from '@/types'

export const NAV_ITEMS: NavItem[] = [
  { title: 'Introduction', href: '/', section: 'Learn' },
  { title: 'Browser AI', href: '/browser-ai', section: 'Learn' },
  { title: 'How Transformer.js Works', href: '/how-it-works', section: 'Learn' },
  { title: 'Text Classification', href: '/text-classification', section: 'Capabilities' },
  { title: 'Embeddings', href: '/embeddings', section: 'Capabilities' },
  { title: 'Summarization', href: '/summarization', section: 'Capabilities' },
  { title: 'Question Answering', href: '/question-answering', section: 'Capabilities' },
  { title: 'Translation', href: '/translation', section: 'Capabilities' },
  { title: 'Text Generation', href: '/text-generation', section: 'Capabilities' },
  { title: 'Image Classification', href: '/image-classification', section: 'Capabilities' },
  { title: 'Speech Recognition', href: '/speech-recognition', section: 'Capabilities' },
  { title: 'Performance Explorer', href: '/performance', section: 'Systems' },
  { title: 'Browser Storage', href: '/browser-storage', section: 'Systems' },
  { title: 'Architecture', href: '/architecture', section: 'Systems' },
  { title: 'Enterprise Use Cases', href: '/enterprise', section: 'Strategy' },
  { title: 'Decision Matrix', href: '/decision-matrix', section: 'Strategy' },
]

export const PAGE_EXPLAINS: Record<string, string> = {
  '/':
    'Browser AI runs ML models inside the user’s browser using Transformers.js and ONNX Runtime — private, offline-capable, and free of a Python backend.',
  '/browser-ai':
    'Browser AI keeps inference on-device. Trade-offs: strong privacy and low latency after load, but constrained by model size, memory, and browser compute.',
  '/how-it-works':
    'Transformers.js loads ONNX models from Hugging Face, tokenizes inputs, runs ONNX Runtime (WebGPU or WASM), and post-processes outputs via pipelines.',
  '/text-classification':
    'Maps text to labels (e.g. sentiment). Ideal for CRM triage, ticket routing, and content moderation — all without sending data to a server.',
  '/embeddings':
    'Turns text into vectors for semantic similarity. Foundation for local search, duplicate detection, and lightweight RAG retrieval.',
  '/summarization':
    'Compresses long text into shorter abstracts. Useful for meeting notes, ticket summaries, and executive briefs on-device.',
  '/question-answering':
    'Extractive QA finds answer spans inside a provided context — great for policy look-ups and knowledge base snippets.',
  '/translation':
    'Neural machine translation (EN→FR here) for local, private language conversion without cloud APIs.',
  '/text-generation':
    'Small local LLMs can draft short replies. Not a replacement for large cloud models — best for constrained, private prompts.',
  '/image-classification':
    'Vision Transformers label uploaded images on-device — useful for asset tagging and lightweight visual triage.',
  '/speech-recognition':
    'Whisper Tiny transcribes English audio locally — useful for meeting notes and voice capture without uploading audio.',
  '/performance':
    'Compare download size, cold vs warm load, and inference latency across tasks. Prefer WebGPU when available.',
  '/browser-storage':
    'Models cache in Cache Storage / IndexedDB. After first download, subsequent visits can run offline from cache.',
  '/architecture':
    'Traditional stacks: Browser → Backend → Python → LLM. Browser AI: Browser → Transformers.js → ONNX Runtime → Model.',
  '/enterprise':
    'Departments can adopt Browser AI for privacy-sensitive, latency-tolerant, small-model workflows — not for large reasoning.',
  '/decision-matrix':
    'Use Browser AI for privacy/offline/small tasks; Cloud for large models; Both for hybrid RAG and tiered routing.',
}
