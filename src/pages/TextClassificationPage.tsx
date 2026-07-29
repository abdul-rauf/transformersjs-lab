import { CapabilityPage } from '@/components/capability/CapabilityPage'
import { TextClassificationDemo } from '@/components/demo/TextClassificationDemo'

export function TextClassificationPage() {
  return <CapabilityPage taskId="text-classification" demo={<TextClassificationDemo />} />
}
