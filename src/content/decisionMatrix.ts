export type Recommendation = 'browser' | 'cloud' | 'both'

export interface DecisionRow {
  useCase: string
  recommendation: Recommendation
  rationale: string
}

export const DECISION_MATRIX: DecisionRow[] = [
  {
    useCase: 'Sentiment Analysis',
    recommendation: 'browser',
    rationale: 'Small classifiers are accurate enough and privacy-friendly on-device.',
  },
  {
    useCase: 'Embeddings',
    recommendation: 'both',
    rationale: 'Browser for small corpora; cloud/vector DB when scale or multi-tenant search is required.',
  },
  {
    useCase: 'RAG',
    recommendation: 'both',
    rationale: 'Retrieve locally or via API; generate with cloud LLMs for quality, or tiny local models for drafts.',
  },
  {
    useCase: 'OCR',
    recommendation: 'cloud',
    rationale: 'High-quality OCR often needs specialized services; browser models are improving but uneven.',
  },
  {
    useCase: 'Speech',
    recommendation: 'both',
    rationale: 'Whisper Tiny works offline for English notes; cloud for multilingual/real-time accuracy.',
  },
  {
    useCase: 'Translation',
    recommendation: 'both',
    rationale: 'Pair MT models work in-browser; cloud wins for many languages and domain quality.',
  },
  {
    useCase: 'Chatbots',
    recommendation: 'cloud',
    rationale: 'Open-ended dialogue quality still favors large hosted models.',
  },
  {
    useCase: 'Coding Assistant',
    recommendation: 'cloud',
    rationale: 'Code reasoning and large context windows exceed practical browser limits.',
  },
  {
    useCase: 'Large Reasoning',
    recommendation: 'cloud',
    rationale: 'Multi-step reasoning models are too large for typical browser memory budgets.',
  },
  {
    useCase: 'Large Documents',
    recommendation: 'cloud',
    rationale: 'Long context and chunk orchestration fit server-side pipelines better.',
  },
  {
    useCase: 'Offline Applications',
    recommendation: 'browser',
    rationale: 'Cached ONNX models enable air-gapped and airplane-mode inference.',
  },
  {
    useCase: 'Privacy-sensitive Applications',
    recommendation: 'browser',
    rationale: 'Keeping raw data on-device simplifies compliance for PII-heavy workflows.',
  },
]
