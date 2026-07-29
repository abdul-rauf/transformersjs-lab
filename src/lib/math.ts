export function cosineSimilarity(a: number[], b: number[]): number {
  if (a.length !== b.length || a.length === 0) return 0
  let dot = 0
  let normA = 0
  let normB = 0
  for (let i = 0; i < a.length; i++) {
    dot += a[i]! * b[i]!
    normA += a[i]! * a[i]!
    normB += b[i]! * b[i]!
  }
  const denom = Math.sqrt(normA) * Math.sqrt(normB)
  return denom === 0 ? 0 : dot / denom
}

export function meanPool(embeddings: number[][]): number[] {
  if (embeddings.length === 0) return []
  const dims = embeddings[0]!.length
  const result = new Array(dims).fill(0) as number[]
  for (const row of embeddings) {
    for (let i = 0; i < dims; i++) {
      result[i]! += row[i]!
    }
  }
  for (let i = 0; i < dims; i++) {
    result[i]! /= embeddings.length
  }
  return result
}

export function l2Normalize(vec: number[]): number[] {
  const norm = Math.sqrt(vec.reduce((s, v) => s + v * v, 0))
  if (norm === 0) return vec
  return vec.map((v) => v / norm)
}
