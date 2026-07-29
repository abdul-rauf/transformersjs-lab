export const GLOSSARY: Record<string, string> = {
  Transformer:
    'A neural architecture that uses self-attention to model relationships between all tokens in a sequence in parallel — the foundation of modern LLMs.',
  Token:
    'A subword unit produced by tokenization. Models do not read raw characters; they operate on discrete token IDs.',
  Tokenizer:
    'The preprocessing component that splits text into tokens and maps them to integer IDs the model understands.',
  Embedding:
    'A dense vector representation of text (or other modalities) that preserves semantic meaning for similarity and retrieval.',
  Inference:
    'Running a trained model forward to produce predictions — as opposed to training, which updates weights.',
  Attention:
    'A mechanism that lets each token weigh how much to “look at” every other token when building contextual representations.',
  ONNX:
    'Open Neural Network Exchange — a portable model format that lets models trained in PyTorch/TF run in other runtimes.',
  'ONNX Runtime':
    'Microsoft’s high-performance inference engine. In the browser it runs via WASM or WebGPU backends.',
  WebGPU:
    'A modern browser API for GPU compute and graphics. Transformers.js can use it for significantly faster inference.',
  WASM:
    'WebAssembly — near-native bytecode that runs in the browser. Used as the default CPU backend for ONNX Runtime Web.',
  'Cosine Similarity':
    'A measure of angle similarity between two vectors (range −1 to 1). Higher values mean more semantic alignment.',
  RAG:
    'Retrieval-Augmented Generation — retrieve relevant chunks (often via embeddings) then condition a generator on them.',
  'Hugging Face':
    'The ecosystem (Hub, libraries, Spaces) for sharing and running ML models. Transformers.js loads ONNX models from the Hub.',
  Quantization:
    'Reducing weight precision (e.g. q8, q4) to shrink download size and memory at a small accuracy cost.',
  Pipeline:
    'A high-level Transformers.js API that bundles tokenizer, model, and post-processing for a given task.',
}

export type GlossaryTerm = keyof typeof GLOSSARY
