import { CapabilityPage } from '@/components/capability/CapabilityPage'
import { EmbeddingsDemo } from '@/components/demo/EmbeddingsDemo'

export function EmbeddingsPage() {
  return <CapabilityPage taskId="embeddings" demo={<EmbeddingsDemo />} />
}
