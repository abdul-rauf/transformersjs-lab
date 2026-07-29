import { CapabilityPage } from '@/components/capability/CapabilityPage'
import { ImageClassificationDemo } from '@/components/demo/ImageClassificationDemo'

export function ImageClassificationPage() {
  return <CapabilityPage taskId="image-classification" demo={<ImageClassificationDemo />} />
}
