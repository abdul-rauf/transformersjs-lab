import type { CapabilityContent } from '@/types'

export const CAPABILITY_CONTENT: Record<string, CapabilityContent> = {
  'text-classification': {
    id: 'text-classification',
    title: 'Text Classification',
    overview: {
      what: 'Text classification assigns a discrete label to a piece of text — for example, positive vs negative sentiment, topic, or intent.',
      why: 'Architects use it to automate triage: CRM lead scoring, support ticket routing, content moderation, and compliance flagging — without a GPU server.',
      how: 'A tokenizer converts text to tokens; a DistilBERT encoder produces contextual representations; a classification head outputs class probabilities via softmax.',
    },
    enterpriseUseCases: [
      { title: 'CRM', description: 'Score inbound email/chat sentiment before assigning an owner.' },
      { title: 'Support', description: 'Route tickets by urgency or tone without cloud round-trips.' },
      { title: 'QA', description: 'Flag toxic or off-brand copy in review workflows.' },
      { title: 'Sales', description: 'Detect buying signals in call notes and emails.' },
    ],
    limitations: [
      'Binary SST-2 labels are not domain-specific out of the box.',
      'Long documents exceed the model context window (~512 tokens).',
      'Quality is weaker than large cloud classifiers on niche taxonomies.',
      'First load downloads ~67 MB; plan for caching and UX.',
    ],
    explainSummary:
      'Local DistilBERT sentiment: enter text, get label + confidence, all on-device via ONNX.',
  },
  embeddings: {
    id: 'embeddings',
    title: 'Embeddings',
    overview: {
      what: 'Embeddings map text into a fixed-size vector space where semantic closeness ≈ geometric closeness.',
      why: 'They power similarity search, clustering, deduplication, and the retrieval stage of RAG — often the highest-ROI Browser AI capability.',
      how: 'MiniLM encodes sentences into 384-d vectors. Cosine similarity compares two vectors; values near 1 mean high semantic overlap.',
    },
    enterpriseUseCases: [
      { title: 'Knowledge Base', description: 'Semantic search over FAQs without a vector DB for small corpora.' },
      { title: 'CRM', description: 'Find similar past opportunities or cases.' },
      { title: 'Analytics', description: 'Cluster open-ended survey responses.' },
      { title: 'Legal', description: 'Near-duplicate contract clause detection.' },
    ],
    limitations: [
      '384-d MiniLM is strong for short text, weaker for long documents.',
      'No cross-lingual guarantees with an English-centric model.',
      'Large corpora still need indexing (IndexedDB / OPFS / server).',
      'Embedding quality ≠ generative understanding.',
    ],
    explainSummary:
      'Encode two sentences, compute cosine similarity, visualize semantic closeness locally.',
  },
  summarization: {
    id: 'summarization',
    title: 'Summarization',
    overview: {
      what: 'Summarization compresses long text into a shorter abstract that preserves key points.',
      why: 'Useful for meeting notes, ticket digests, research abstracts, and executive briefs generated privately on-device.',
      how: 'An encoder-decoder (DistilBART) encodes the source and decodes a shorter sequence conditioned on that representation.',
    },
    enterpriseUseCases: [
      { title: 'Support', description: 'Condense long ticket threads for agents.' },
      { title: 'Legal', description: 'Draft high-level summaries of filings (human-reviewed).' },
      { title: 'HR', description: 'Summarize interview notes for hiring panels.' },
      { title: 'Analytics', description: 'Digest qualitative feedback batches.' },
    ],
    limitations: [
      'May hallucinate details on complex documents.',
      'Input length is constrained by model context.',
      'Larger download (~300 MB) than classification models.',
      'Not a substitute for domain-expert review.',
    ],
    explainSummary:
      'Paste a long paragraph, generate an abstractive summary, compare lengths and timing.',
  },
  'question-answering': {
    id: 'question-answering',
    title: 'Question Answering',
    overview: {
      what: 'Extractive QA finds the span inside a provided context that best answers a question.',
      why: 'Ideal for policy look-ups, FAQ bots, and document assistants when the answer must come from trusted text.',
      how: 'The model scores start/end token positions over the context; the highest-scoring span is returned with a confidence score.',
    },
    enterpriseUseCases: [
      { title: 'Knowledge Base', description: 'Answer from curated policy paragraphs.' },
      { title: 'Support', description: 'Pull answers from product docs offline.' },
      { title: 'Legal', description: 'Locate clauses answering counsel questions.' },
      { title: 'Internal Tools', description: 'Inline help over runbooks.' },
    ],
    limitations: [
      'Extractive only — cannot invent answers outside the context.',
      'Fails if the answer is not literally present.',
      'Context window limits long documents.',
      'Multi-hop reasoning requires retrieval + larger models.',
    ],
    explainSummary:
      'Provide context + question; DistilBERT returns an answer span and confidence locally.',
  },
  translation: {
    id: 'translation',
    title: 'Translation',
    overview: {
      what: 'Neural machine translation maps text from a source language to a target language.',
      why: 'Enable private, offline localization of UI strings, tickets, and customer messages without cloud MT APIs.',
      how: 'OPUS-MT uses an encoder-decoder seq2seq architecture trained on parallel corpora (English → French in this demo).',
    },
    enterpriseUseCases: [
      { title: 'Support', description: 'Translate tickets for multilingual agents.' },
      { title: 'Sales', description: 'Localize outreach drafts offline.' },
      { title: 'Browser Extensions', description: 'In-page translation without leaking content.' },
      { title: 'HR', description: 'Translate policy snippets for global teams.' },
    ],
    limitations: [
      'Pair-specific models (EN→FR); many languages need separate models.',
      'Domain jargon quality varies.',
      'Long documents may need chunking.',
      'Not as strong as large multilingual cloud MT systems.',
    ],
    explainSummary:
      'Translate English to French entirely in-browser with OPUS-MT.',
  },
  'text-generation': {
    id: 'text-generation',
    title: 'Text Generation',
    overview: {
      what: 'Text generation predicts the next tokens to produce free-form completions or chat-style replies.',
      why: 'Small local generators can draft short replies, rewrite copy, or power constrained assistants without sending prompts to a vendor.',
      how: 'An autoregressive decoder (SmolLM2) samples tokens sequentially; each step conditions on previous tokens via causal attention.',
    },
    enterpriseUseCases: [
      { title: 'CRM', description: 'Draft short follow-up email suggestions.' },
      { title: 'Support', description: 'Suggest reply templates from ticket text.' },
      { title: 'Engineering', description: 'Local snippet helpers in internal tools.' },
      { title: 'Browser Extensions', description: 'Rewrite selected text privately.' },
    ],
    limitations: [
      '135M–0.5B models cannot match GPT-class reasoning.',
      'Hallucinations still occur — always review.',
      'Generation is slower than classification on CPU.',
      'Long-context chat is impractical in-browser.',
    ],
    explainSummary:
      'Run a tiny local instruct model to generate a short response and measure latency.',
  },
  'image-classification': {
    id: 'image-classification',
    title: 'Image Classification',
    overview: {
      what: 'Image classification predicts a category label for an entire image (e.g. ImageNet classes).',
      why: 'Useful for asset tagging, visual triage, and lightweight moderation without uploading images to a server.',
      how: 'A Vision Transformer splits the image into patches, embeds them, and classifies via a transformer encoder + head.',
    },
    enterpriseUseCases: [
      { title: 'CRM / Marketing', description: 'Auto-tag product photos in DAM systems.' },
      { title: 'QA', description: 'Flag unexpected visual content in uploads.' },
      { title: 'Analytics', description: 'Categorize user-submitted images.' },
      { title: 'Internal Tools', description: 'Assist with inventory photo labeling.' },
    ],
    limitations: [
      'ImageNet labels may not match business taxonomies.',
      'Not object detection — one label for the whole image.',
      'Large images need resizing; quality can drop.',
      'Fine-grained domains need fine-tuned models.',
    ],
    explainSummary:
      'Upload an image; ViT predicts ImageNet labels with confidence scores on-device.',
  },
  'speech-recognition': {
    id: 'speech-recognition',
    title: 'Speech Recognition',
    overview: {
      what: 'Automatic speech recognition (ASR) converts audio waveforms into text transcripts.',
      why: 'Enable private voice notes, meeting snippets, and accessibility features without uploading audio.',
      how: 'Whisper encodes mel spectrograms and decodes text tokens. The tiny.en variant is English-only and browser-friendly.',
    },
    enterpriseUseCases: [
      { title: 'Support', description: 'Transcribe voicemail snippets locally.' },
      { title: 'Sales', description: 'Capture call notes without cloud ASR.' },
      { title: 'HR', description: 'Interview note-taking with privacy controls.' },
      { title: 'Browser Extensions', description: 'Dictation into form fields.' },
    ],
    limitations: [
      'Tiny model struggles with accents, noise, and jargon.',
      'Long audio should be chunked.',
      'Non-English needs multilingual Whisper variants.',
      'Real-time streaming is more complex than batch upload.',
    ],
    explainSummary:
      'Upload English audio; Whisper Tiny produces a local transcript.',
  },
}
